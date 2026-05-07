import { useEffect } from 'react';

/**
 * useHotkey
 * Custom hook to bind global hotkeys. 
 * Supports Ctrl/Meta (Cmd) normalization for cross-platform planning.
 */
export function useHotkey(
  key: string, 
  callback: () => void, 
  options: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; altKey?: boolean; enabled?: boolean } = { enabled: true }
) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Basic key check
      const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();
      
      // Modifier checks
      // On Mac, metaKey is Command. On PC, ctrlKey is Ctrl.
      // We often treat them similarly for "Primary" action modifier.
      const isModifierMatch = (options.ctrlKey || options.metaKey) 
        ? (event.ctrlKey || event.metaKey) 
        : true;

      const isShiftMatch = options.shiftKey !== undefined ? event.shiftKey === options.shiftKey : true;
      const isAltMatch = options.altKey !== undefined ? event.altKey === options.altKey : true;

      if (isKeyMatch && isModifierMatch && isShiftMatch && isAltMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options]);
}
