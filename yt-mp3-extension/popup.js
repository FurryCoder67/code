// YT Grab - popup.js
// Communicates with a local native helper (yt-dlp) via native messaging

const NATIVE_HOST = 'com.ytgrab.helper';
// Fallback: local HTTP bridge on port 9876 (see companion app)
const LOCAL_BRIDGE = 'http://localhost:9876';

let currentFormat = 'mp3';
let currentQuality = 'best';
let currentVideoId = null;
let currentVideoInfo = null;

// ─── UI refs ─────────────────────────────────────────────────────────────────
const videoCard    = document.getElementById('videoCard');
const notYt        = document.getElementById('notYt');
const videoTitle   = document.getElementById('videoTitle');
const videoMeta    = document.getElementById('videoMeta');
const videoThumb   = document.getElementById('videoThumb');
const dlBtn        = document.getElementById('dlBtn');
const progressSec  = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressLbl  = document.getElementById('progressLabel');
const statusMsg    = document.getElementById('statusMsg');
const qualityRow   = document.getElementById('qualityRow');

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) return showNotYt();

    const url = new URL(tab.url);
    if (!url.hostname.includes('youtube.com')) return showNotYt();

    const videoId = url.searchParams.get('v');
    if (!videoId) return showNotYt('Navigate to a specific YouTube video.');

    currentVideoId = videoId;
    await loadVideoInfo(tab.id, videoId);
  } catch (e) {
    showNotYt();
  }
}

function showNotYt(msg) {
  notYt.classList.add('visible');
  if (msg) notYt.querySelector('p').textContent = msg;
}

// ─── Load video info via content script ──────────────────────────────────────
async function loadVideoInfo(tabId, videoId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: extractVideoInfo
    });

    const info = results?.[0]?.result;
    if (!info) throw new Error('Could not extract info');

    currentVideoInfo = info;
    renderVideoCard(info, videoId);
    dlBtn.disabled = false;
  } catch (e) {
    // Fallback: show card with just video ID
    renderVideoCard({ title: 'YouTube Video', author: '', duration: '' }, videoId);
    dlBtn.disabled = false;
  }
}

function renderVideoCard(info, videoId) {
  videoCard.classList.add('visible');
  videoTitle.textContent = info.title || 'Unknown Title';
  videoMeta.textContent  = [info.author, info.duration].filter(Boolean).join(' · ') || videoId;
  videoThumb.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  videoThumb.onerror = () => { videoThumb.style.display = 'none'; };
}

// Runs in page context
function extractVideoInfo() {
  try {
    const data = window.ytInitialPlayerResponse;
    if (!data) return null;
    const details = data.videoDetails;
    return {
      title: details.title,
      author: details.author,
      duration: formatDuration(parseInt(details.lengthSeconds))
    };
  } catch { return null; }

  function formatDuration(s) {
    if (!s) return '';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}:${String(m % 60).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${m}:${String(sec).padStart(2,'0')}`;
  }
}

// ─── Format & quality selectors ──────────────────────────────────────────────
document.querySelectorAll('.format-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFormat = btn.dataset.format;
    updateQualityOptions();
  });
});

document.querySelectorAll('.quality-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.quality-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentQuality = chip.dataset.quality;
  });
});

function updateQualityOptions() {
  const chips = document.querySelectorAll('.quality-chip');
  if (currentFormat === 'mp3') {
    // Audio quality
    chips.forEach(c => {
      const q = c.dataset.quality;
      c.textContent = q === 'best' ? 'BEST' : q === '720' ? '320kbps' : q === '480' ? '192kbps' : '128kbps';
    });
  } else {
    chips.forEach(c => {
      const q = c.dataset.quality;
      c.textContent = q === 'best' ? 'BEST' : q + 'p';
    });
  }
}

// ─── Download ─────────────────────────────────────────────────────────────────
dlBtn.addEventListener('click', startDownload);

async function startDownload() {
  if (!currentVideoId) return;

  dlBtn.disabled = true;
  showProgress(true);
  hideStatus();

  const videoUrl = `https://www.youtube.com/watch?v=${currentVideoId}`;

  setProgress(0, 'indeterminate', 'Connecting to local helper...');

  try {
    // Try local HTTP bridge first (easier to set up than native messaging)
    await downloadViaBridge(videoUrl);
  } catch (e) {
    showStatus('error', `Error: ${e.message}. Is the YT Grab companion app running?`);
    showProgress(false);
    dlBtn.disabled = false;
  }
}

async function downloadViaBridge(videoUrl) {
  // The companion app (see README) runs a tiny local server on port 9876
  // POST /download → streams progress via SSE or polls /status/:id

  setProgress(0, 'indeterminate', 'Sending request...');

  const payload = {
    url: videoUrl,
    format: currentFormat,
    quality: currentQuality,
    title: currentVideoInfo?.title || currentVideoId
  };

  let response;
  try {
    response = await fetch(`${LOCAL_BRIDGE}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    throw new Error('Cannot reach local helper. Make sure the YT Grab app is running on port 9876.');
  }

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || 'Download failed');
  }

  const { jobId } = await response.json();
  await pollProgress(jobId);
}

async function pollProgress(jobId) {
  const maxAttempts = 300; // 5 min at 1s intervals
  let attempts = 0;

  while (attempts < maxAttempts) {
    await sleep(1000);
    attempts++;

    let data;
    try {
      const r = await fetch(`${LOCAL_BRIDGE}/status/${jobId}`);
      data = await r.json();
    } catch {
      continue;
    }

    if (data.status === 'downloading') {
      const pct = data.percent || 0;
      setProgress(pct, 'normal', `Downloading... ${pct.toFixed(1)}%`);
    } else if (data.status === 'converting') {
      setProgress(data.percent || 90, 'normal', 'Converting...');
    } else if (data.status === 'done') {
      setProgress(100, 'normal', 'Done!');

      // Trigger download of the finished file
      await triggerFileDownload(jobId, data.filename);

      showStatus('success', `✓ Downloaded: ${data.filename}`);
      showProgress(false);
      dlBtn.disabled = false;
      return;
    } else if (data.status === 'error') {
      throw new Error(data.message || 'Unknown error');
    }
  }

  throw new Error('Timed out');
}

async function triggerFileDownload(jobId, filename) {
  // Ask the bridge to return the file, or open the output folder
  const fileUrl = `${LOCAL_BRIDGE}/file/${jobId}`;

  try {
    // Use chrome.downloads API to trigger the save dialog
    await chrome.downloads.download({
      url: fileUrl,
      filename: filename,
      saveAs: true
    });
  } catch {
    // Fallback: open in new tab
    chrome.tabs.create({ url: fileUrl });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function showProgress(visible) {
  progressSec.classList.toggle('visible', visible);
  if (!visible) {
    progressFill.style.width = '0%';
    progressFill.classList.remove('indeterminate');
  }
}

function setProgress(pct, mode, label) {
  progressLbl.textContent = label;
  if (mode === 'indeterminate') {
    progressFill.classList.add('indeterminate');
  } else {
    progressFill.classList.remove('indeterminate');
    progressFill.style.width = pct + '%';
  }
}

function showStatus(type, msg) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg visible' + (type === 'error' ? ' error' : '');
}

function hideStatus() {
  statusMsg.className = 'status-msg';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Boot ─────────────────────────────────────────────────────────────────────
init();
