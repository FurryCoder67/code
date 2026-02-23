// YT Grab - background.js (service worker)
// Handles extension lifecycle events

chrome.runtime.onInstalled.addListener(() => {
  console.log('YT Grab installed');
});

// Forward download requests from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'DOWNLOAD') {
    // Could relay to native host here if needed
    sendResponse({ ok: true });
  }
});
