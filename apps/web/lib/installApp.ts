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

// Trigger prompt on click
btn?.addEventListener('click', async () => {
  if (deferredPrompt) {
    await deferredPrompt.prompt();
    deferredPrompt = null;
    btn.style.display = 'none';
  }
});
