#!/usr/bin/env node
// YT Grab Companion App
// A tiny local HTTP server that bridges the Chrome extension to yt-dlp
//
// SETUP:
//   npm install express cors uuid
//   node companion.js
//
// REQUIRES: yt-dlp installed and on PATH
//   macOS:   brew install yt-dlp
//   Windows: winget install yt-dlp
//   Linux:   sudo pip install yt-dlp

const express = require('express');
const cors    = require('cors');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const path    = require('path');
const fs      = require('fs');
const os      = require('os');

const app  = express();
const PORT = 9876;

// Output folder - Desktop by default
const OUTPUT_DIR = path.join(os.homedir(), 'Desktop', 'YTGrab');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory job store
const jobs = {};

// ─── POST /download ───────────────────────────────────────────────────────────
app.post('/download', (req, res) => {
  const { url, format, quality, title } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  const jobId = uuidv4();
  jobs[jobId] = { status: 'starting', percent: 0, filename: null, error: null, filePath: null };

  res.json({ jobId });

  // Run yt-dlp in background
  runDownload(jobId, url, format, quality);
});

// ─── GET /status/:id ─────────────────────────────────────────────────────────
app.get('/status/:id', (req, res) => {
  const job = jobs[req.params.id];
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// ─── GET /file/:id ────────────────────────────────────────────────────────────
app.get('/file/:id', (req, res) => {
  const job = jobs[req.params.id];
  if (!job || !job.filePath) return res.status(404).json({ error: 'File not ready' });
  if (!fs.existsSync(job.filePath)) return res.status(404).json({ error: 'File missing' });

  res.download(job.filePath, job.filename);
});

// ─── Download logic ───────────────────────────────────────────────────────────
function runDownload(jobId, url, format, quality) {
  const job = jobs[jobId];

  // Build yt-dlp args
  let args = [];

  if (format === 'mp3') {
    const audioBitrate = quality === 'best' || quality === '720' ? '320' : quality === '480' ? '192' : '128';
    args = [
      '--extract-audio',
      '--audio-format', 'mp3',
      '--audio-quality', audioBitrate + 'K',
      '--output', path.join(OUTPUT_DIR, '%(title)s.%(ext)s'),
      '--newline',
      url
    ];
  } else {
    // MP4
    let formatStr = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
    if (quality !== 'best') {
      formatStr = `bestvideo[height<=${quality}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${quality}][ext=mp4]/best[height<=${quality}]`;
    }
    args = [
      '--format', formatStr,
      '--merge-output-format', 'mp4',
      '--output', path.join(OUTPUT_DIR, '%(title)s.%(ext)s'),
      '--newline',
      url
    ];
  }

  console.log(`[${jobId}] Starting: yt-dlp ${args.join(' ')}`);

  const proc = spawn('yt-dlp', args);

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      console.log(`[${jobId}]`, line);

      // Parse progress: [download]  45.3% of ...
      const dlMatch = line.match(/\[download\]\s+([\d.]+)%/);
      if (dlMatch) {
        job.status = 'downloading';
        job.percent = parseFloat(dlMatch[1]);
        continue;
      }

      // Conversion
      if (line.includes('[ExtractAudio]') || line.includes('Merging')) {
        job.status = 'converting';
        job.percent = 90;
        continue;
      }

      // Destination file
      const destMatch = line.match(/Destination:\s+(.+)/) || line.match(/\[ExtractAudio\] Destination:\s+(.+)/);
      if (destMatch) {
        job.filePath = destMatch[1].trim();
        job.filename = path.basename(job.filePath);
        continue;
      }

      // Already downloaded
      if (line.includes('has already been downloaded')) {
        const fileMatch = line.match(/\[download\] (.+) has already/);
        if (fileMatch) {
          job.filePath = fileMatch[1].trim();
          job.filename = path.basename(job.filePath);
        }
      }
    }
  });

  proc.stderr.on('data', (data) => {
    console.error(`[${jobId}] STDERR:`, data.toString());
  });

  proc.on('close', (code) => {
    if (code === 0) {
      // Find the output file if we don't have it yet
      if (!job.filePath) {
        const ext = format === 'mp3' ? '.mp3' : '.mp4';
        const files = fs.readdirSync(OUTPUT_DIR)
          .filter(f => f.endsWith(ext))
          .map(f => ({ f, t: fs.statSync(path.join(OUTPUT_DIR, f)).mtime }))
          .sort((a, b) => b.t - a.t);
        if (files.length > 0) {
          job.filePath = path.join(OUTPUT_DIR, files[0].f);
          job.filename = files[0].f;
        }
      }
      job.status = 'done';
      job.percent = 100;
      console.log(`[${jobId}] Done → ${job.filePath}`);
    } else {
      job.status = 'error';
      job.message = `yt-dlp exited with code ${code}`;
      console.error(`[${jobId}] Failed with code ${code}`);
    }
  });

  proc.on('error', (err) => {
    job.status = 'error';
    job.message = err.code === 'ENOENT'
      ? 'yt-dlp not found. Please install it: https://github.com/yt-dlp/yt-dlp#installation'
      : err.message;
    console.error(`[${jobId}] Error:`, err);
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, '127.0.0.1', () => {
  console.log(`
╔══════════════════════════════════════╗
║        YT Grab Companion App         ║
╠══════════════════════════════════════╣
║  Running on: http://localhost:${PORT}  ║
║  Output dir: ~/Desktop/YTGrab        ║
╚══════════════════════════════════════╝
  `);
});
