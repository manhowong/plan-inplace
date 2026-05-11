/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function initDeviceGuard() {
  const launchLink = document.getElementById('launchApp');
  const guardOverlay = document.getElementById('guard-overlay');
  const guardContent = document.getElementById('guard-content');

  if (!launchLink || !guardOverlay || !guardContent) return;

  launchLink.addEventListener('click', (e) => {
    const isVsCode = !!(window as any).vscode || (window as any).acquireVsCodeApi;
    const isInIframe = window.self !== window.top && !isVsCode;
    const isSupported = 'showDirectoryPicker' in window;
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    if (isInIframe) {
      e.preventDefault();
      showIframeGuard();
      return;
    }

    if (!isSupported) {
      e.preventDefault();
      showUnsupportedGuard();
      return;
    }

    if (isMobile) {
      e.preventDefault();
      showMobileGuard();
      return;
    }
  });

  function showIframeGuard() {
    guardContent.innerHTML = `
      <div class="max-w-md w-full bg-card p-8 rounded-md border border-border text-center shadow-2xl relative">
        <h1 class="text-4xl font-bold mb-6 text-accent">:(</h1>
        <h1 class="text-2xl font-bold mb-2 text-text-primary">Embedded Window Detected</h1>
        <div class="flex flex-col gap-3">
          <p class="text-text-secondary mb-4">
            Browsers block the File System Access API in iframes (embedded windows) for security. 
            Please <strong>open the app in a new tab</strong>.
          </p>
          <button id="openNewTab" class="w-full py-2.5 mb-2 bg-accent text-white rounded-md cursor-pointer hover:bg-accent/90 transition-colors font-medium">
            Open in New Tab
          </button>
          <button id="bypassIframe" class="text-[11px] text-accent hover:underline cursor-pointer bg-transparent border-none">
            Already in a new tab? Click here to bypass this check.
          </button>
        </div>
      </div>
    `;
    guardOverlay.classList.remove('hidden');
    
    document.getElementById('openNewTab')?.addEventListener('click', () => {
       window.open(window.location.href, '_blank');
    });
    document.getElementById('bypassIframe')?.addEventListener('click', () => {
       window.location.href = '/app.html';
    });
  }

  function showUnsupportedGuard() {
     guardContent.innerHTML = `
      <div class="max-w-md w-full bg-card p-8 rounded-md border border-border text-center shadow-2xl">
        <h1 class="text-4xl font-bold mb-6 text-accent">:(</h1>
        <h1 class="text-2xl font-bold mb-2 text-text-primary text-center">Browser Unsupported</h1>
        <p class="font-bold text-left pl-4 mt-8 mb-1">Supported Browsers (Desktop):</p>
        <ul class="list-inside text-left pl-4 space-y-1 text-text-secondary">
          <li>Google Chrome</li>
          <li>Microsoft Edge</li>
          <li>Brave Browser</li>
        </ul>
        <button id="closeGuard" class="mt-8 text-sm text-accent hover:underline cursor-pointer bg-transparent border-none">Close</button>
      </div>
    `;
    guardOverlay.classList.remove('hidden');
    document.getElementById('closeGuard')?.addEventListener('click', () => {
      guardOverlay.classList.add('hidden');
    });
  }

  function showMobileGuard() {
    guardContent.innerHTML = `
      <div class="max-w-md w-full bg-card p-8 rounded-md border border-border text-center shadow-2xl">
        <h1 class="text-4xl font-bold mb-6 text-accent">:(</h1>
        <h1 class="text-2xl font-bold mb-2 text-text-primary text-center">Mobile Not Supported</h1>
        <p class="text-text-secondary">
          This application is designed for desktop browsers only. Please open this on a desktop or laptop computer to use the full features.
        </p>
        <button id="closeGuard" class="mt-8 text-sm text-accent hover:underline cursor-pointer bg-transparent border-none">Close</button>
      </div>
    `;
    guardOverlay.classList.remove('hidden');
    document.getElementById('closeGuard')?.addEventListener('click', () => {
      guardOverlay.classList.add('hidden');
    });
  }
}

initDeviceGuard();
