// YT Grab - content.js
// Runs on YouTube pages - exposes video info to popup

// Nothing needed here since popup uses executeScript directly
// This file is a placeholder for future enhancements
// e.g. injecting a download button into the YouTube UI

(function() {
  // Optional: inject a subtle "Grab" button into YouTube's player controls
  // Uncomment below to enable in-page button

  /*
  function injectButton() {
    const controls = document.querySelector('.ytp-right-controls');
    if (!controls || document.getElementById('ytgrab-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'ytgrab-btn';
    btn.title = 'Download with YT Grab';
    btn.innerHTML = '⬇';
    btn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      padding: 0 6px;
      opacity: 0.8;
    `;
    btn.onclick = () => chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
    controls.prepend(btn);
  }

  // Watch for player to load
  const observer = new MutationObserver(injectButton);
  observer.observe(document.body, { childList: true, subtree: true });
  injectButton();
  */
})();
