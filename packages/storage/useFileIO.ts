import { useState, useEffect } from 'react';
import { ROOT_FOLDER_NAME } from '@packages/core/config';
import { BrowserStorage } from './adapters/browser';
import { VSCodeStorage } from './adapters/vscode';
import { StorageManager } from './adapters/base';

/**
 * --------------------------------------------------------------------------
 * useFileIO
 * --------------------------------------------------------------------------
 * Manages the underlying StorageManager instance and detects the environment
 * (Browser vs. VS Code). Provides the raw read/write interface for the app.
 */
export function useFileIO() {
  const [storage, setStorage] = useState<StorageManager | null>(null);

  // --- Adapter Selection ---
  useEffect(() => {
    const vscode = new VSCodeStorage();
    if (vscode.isSupported()) {
      setStorage(vscode);
    } else {
      setStorage(new BrowserStorage());
    }
  }, []);

  return {
    storage,
    setStorage,
    isSupported: storage?.isSupported() || false,
    requestPermission: () => storage?.requestPermission(),
    directoryName: storage?.getDirectoryName() || ROOT_FOLDER_NAME,
    directoryPath: storage?.getDirectoryPath() || ROOT_FOLDER_NAME,
  };
}
