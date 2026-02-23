#!/usr/bin/env node
// YT Grab Companion App
// A tiny local HTTP server that bridges the Chrome extension to yt-dlp
//
// SETUP:
//   npm install express cors uuid archiver
//   sudo node companion.js       ← sudo required for port 443 on Mac/Linux
//   node companion.js            ← Windows (run terminal as Administrator)
//
// REQUIRES: yt-dlp installed and on PATH
//   macOS:   brew install yt-dlp
//   Windows: winget install yt-dlp
//   Linux:   sudo pip install yt-dlp

const express  = require('express');
const cors     = require('cors');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const archiver = require('archiver');
const path     = require('path');
const fs       = require('fs');
const os       = require('os');

const app  = express();
const PORT = 443;

// Output folder - Desktop by default
const OUTPUT_DIR = path.join(os.homedir(), 'Desktop', 'YTGrab');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory job store
const jobs = {};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isPlaylistOnly(url) {
  try {
    const u = new URL(url);
    return u.searchParams.has('list') && !u.searchParams.has('v');
  } catch { return false; }
}

// ─── POST /download ───────────────────────────────────────────────────────────
app.post('/download', (req, res) => {
  const { url, format, quality, playlistMode } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  const jobId   = uuidv4();
  const playlist = playlistMode === true || isPlaylistOnly(url);

  jobs[jobId] = {
    status: 'starting',
    percent: 0,
    filename: null,
    filePath: null,
    playlistDir: null,
    playlist,
    totalItems: 0,
    completedItems: 0,
    currentItem: '',
    files: [],
    message: ''
  };

  res.json({ jobId });
  runDownload(jobId, url, format, quality, playlist);
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
  if (!job) return res.status(404).json({ error: 'Job not found' });

  if (job.playlist) {
    const dir = job.playlistDir;
    if (!dir || !fs.existsSync(dir)) {
      return res.status(404).json({ error: 'Playlist folder not found' });
    }
    const folderName = path.basename(dir);
    res.attachment(`${folderName}.zip`);
    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', err => console.error('Archive error:', err));
    archive.pipe(res);
    archive.directory(dir, folderName);
    archive.finalize();
  } else {
    if (!job.filePath || !fs.existsSync(job.filePath)) {
      return res.status(404).json({ error: 'File not ready' });
    }
    res.download(job.filePath, job.filename);
  }
});

// ─── Download logic ───────────────────────────────────────────────────────────
function runDownload(jobId, url, format, quality, playlist) {
  const job = jobs[jobId];

  // For playlists, create a dedicated subfolder
  let outputDir = OUTPUT_DIR;
  if (playlist) {
    outputDir = path.join(OUTPUT_DIR, `playlist_${jobId.slice(0, 8)}`);
    fs.mkdirSync(outputDir, { recursive: true });
    job.playlistDir = outputDir;
  }

  const outputTemplate = playlist
    ? path.join(outputDir, '%(playlist_index)s - %(title)s.%(ext)s')
    : path.join(outputDir, '%(title)s.%(ext)s');

  let args = [];

  if (format === 'mp3') {
    const bitrate = quality === 'best' || quality === '720' ? '320' :
                    quality === '480' ? '192' : '128';
    args = [
      '--extract-audio',
      '--audio-format', 'mp3',
      '--audio-quality', bitrate + 'K',
      '--output', outputTemplate,
      '--newline'
    ];
  } else {
    let formatStr = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
    if (quality !== 'best') {
      formatStr = `bestvideo[height<=${quality}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${quality}][ext=mp4]/best[height<=${quality}]`;
    }
    args = [
      '--format', formatStr,
      '--merge-output-format', 'mp4',
      '--output', outputTemplate,
      '--newline'
    ];
  }

  args.push(playlist ? '--yes-playlist' : '--no-playlist');
  args.push(url);

  console.log(`[${jobId}] Starting${playlist ? ' PLAYLIST' : ''}: yt-dlp ${args.join(' ')}`);

  const proc = spawn('yt-dlp', args);

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      console.log(`[${jobId}]`, line);

      // Playlist item counter e.g. "Downloading item 3 of 12"
      const itemMatch = line.match(/Downloading item (\d+) of (\d+)/);
      if (itemMatch) {
        job.completedItems = parseInt(itemMatch[1]);
        job.totalItems     = parseInt(itemMatch[2]);
        job.status = 'downloading';
        continue;
      }

      // Per-file download progress
      const dlMatch = line.match(/\[download\]\s+([\d.]+)%/);
      if (dlMatch) {
        const filePct = parseFloat(dlMatch[1]);
        job.status = 'downloading';
        if (playlist && job.totalItems > 0) {
          const overall = ((job.completedItems - 1 + filePct / 100) / job.totalItems) * 100;
          job.percent = Math.min(99, parseFloat(overall.toFixed(1)));
        } else {
          job.percent = filePct;
        }
        continue;
      }

      // Conversion / merging
      if (line.includes('[ExtractAudio]') || line.includes('Merging formats')) {
        job.status = 'converting';
        if (!playlist) job.percent = 95;
        continue;
      }

      // Destination / Moving line → track filename
      const destMatch = line.match(/(?:Destination|Moving):\s+(.+)/);
      if (destMatch) {
        const fp = destMatch[1].trim();
        job.filePath    = fp;
        job.filename    = path.basename(fp);
        job.currentItem = job.filename;
        if (playlist && !job.files.includes(fp)) job.files.push(fp);
        continue;
      }

      // Already downloaded
      const alreadyMatch = line.match(/\[download\] (.+) has already been downloaded/);
      if (alreadyMatch) {
        const fp = alreadyMatch[1].trim();
        job.filePath = fp;
        job.filename = path.basename(fp);
        if (playlist && !job.files.includes(fp)) job.files.push(fp);
      }

      // Rename playlist folder to actual playlist name
      const plTitleMatch = line.match(/Downloading playlist:\s+(.+)/);
      if (plTitleMatch && playlist) {
        const safeName = plTitleMatch[1].trim().replace(/[/\\?%*:|"<>]/g, '-');
        const namedDir = path.join(OUTPUT_DIR, safeName);
        if (outputDir !== namedDir && !fs.existsSync(namedDir)) {
          try {
            fs.renameSync(outputDir, namedDir);
            outputDir       = namedDir;
            job.playlistDir = namedDir;
          } catch (e) {
            console.warn('Could not rename playlist dir:', e.message);
          }
        }
      }
    }
  });

  proc.stderr.on('data', (data) => {
    console.error(`[${jobId}] STDERR:`, data.toString());
  });

  proc.on('close', (code) => {
    if (code === 0) {
      // Fallback: find most recent file if we missed it
      if (!job.filePath && !playlist) {
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
      job.status  = 'done';
      job.percent = 100;
      job.message = playlist
        ? `Downloaded ${job.files.length || job.completedItems} tracks`
        : `Saved: ${job.filename}`;
      console.log(`[${jobId}] ✓ Done`);
    } else {
      job.status  = 'error';
      job.message = `yt-dlp exited with code ${code}`;
      console.error(`[${jobId}] Failed with code ${code}`);
    }
  });

  proc.on('error', (err) => {
    job.status  = 'error';
    job.message = err.code === 'ENOENT'
      ? 'yt-dlp not found. Install it: https://github.com/yt-dlp/yt-dlp#installation'
      : err.message;
    console.error(`[${jobId}] Process error:`, err);
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, '127.0.0.1', () => {
  console.log(`
╔══════════════════════════════════════╗
║        YT Grab Companion App         ║
╠══════════════════════════════════════╣
║  Running on: http://localhost:${PORT}    ║
║  Output dir: ~/Desktop/YTGrab        ║
╚══════════════════════════════════════╝
  `);
});
