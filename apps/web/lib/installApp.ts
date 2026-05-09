// Define the specific event type for Chromium browsers
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const btn = document.getElementById('installApp') as HTMLButtonElement;

// Capture the browser's install event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  if (btn) btn.style.display = 'block';
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  if (btn) btn.style.display = 'none';
});

// Trigger prompt on click, or fallback to the app page when the prompt is unavailable.
btn?.addEventListener('click', async () => {
  if (deferredPrompt) {
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (btn) btn.style.display = 'none';
    if (choiceResult.outcome === 'accepted') {
      console.log('PWA install accepted');
    }
    return;
  }

  // If the browser did not fire the install prompt on index.html, redirect to the real app entry.
  window.location.href = '/app.html';
});
