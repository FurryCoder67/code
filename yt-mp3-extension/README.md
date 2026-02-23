# YT Grab — Chrome Extension

Download YouTube videos as **MP3** or **MP4** directly from your browser.

---

## Architecture

```
Chrome Extension (popup.html)
        ↓  HTTP POST to localhost:9999
Companion App (companion.js / Node.js)
        ↓  spawns
yt-dlp (CLI tool)
        ↓  saves to
~/Desktop/YTGrab/
```

Because Chrome extensions can't run system processes directly, a tiny local server bridges the gap. Your data never leaves your machine.

---

## Setup

### 1. Install yt-dlp

**macOS**
```bash
brew install yt-dlp
```

**Windows**
```powershell
winget install yt-dlp
# or download yt-dlp.exe from https://github.com/yt-dlp/yt-dlp/releases
```

**Linux**
```bash
sudo pip install yt-dlp
# or
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

---

### 2. Start the Companion App

```bash
cd companion-app  # (this folder)
npm install
npm start
```

Keep this terminal window open while using the extension.

---

### 3. Load the Chrome Extension

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder (the one with `manifest.json`)

---

## Usage

1. Make sure the companion app is running (`npm start`)
2. Go to any YouTube video
3. Click the **YT Grab** icon in your toolbar
4. Pick **MP3** or **MP4** and quality
5. Click **GRAB IT**
6. File saves to `~/Desktop/YTGrab/`

---

## File Structure

```
yt-mp3-extension/
├── manifest.json       ← Extension manifest (MV3)
├── popup.html          ← Extension popup UI
├── popup.js            ← Popup logic
├── background.js       ← Service worker
├── content.js          ← YouTube page script
├── companion.js        ← Local Node.js bridge server
├── package.json        ← Node dependencies
└── README.md           ← This file
```

---

## Notes

- **Downloads are saved** to `~/Desktop/YTGrab/` by default. Edit `companion.js` to change.
- **Port 9999** must be free. Change `PORT` in `companion.js` and `LOCAL_BRIDGE` in `popup.js` if needed.
- Downloading YouTube videos may violate YouTube's Terms of Service. Use responsibly for content you have rights to.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Cannot reach local helper" | Run `npm start` in the companion folder |
| "yt-dlp not found" | Install yt-dlp and make sure it's on your PATH |
| Extension not showing | Enable Developer Mode in `chrome://extensions` |
| Video info not loading | Refresh the YouTube page, then click the extension |
