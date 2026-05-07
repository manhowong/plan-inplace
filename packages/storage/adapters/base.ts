export interface StorageManager {
  type: 'browser' | 'vscode';
  isSupported(): boolean;
  hasPermission(): Promise<boolean>;
  requestPermission(): Promise<boolean>;
  getFiles(): Promise<{ name: string; content: string }[]>;
  listFiles(): Promise<string[]>;
  readFile(name: string): Promise<string | null>;
  writeFile(name: string, content: string): Promise<void>;
  deleteFile(name: string): Promise<void>;
  clearPlanData(): Promise<void>;
  getDirectoryName(): string;
  getDirectoryPath(): string;
  onUpdate(callback: () => void): void;
  hasEntry(name: string): Promise<boolean>;
  
  // Standard Lifecycle
  registerPlan(id: string, name: string): Promise<void>;
  openBookmark(plan: any): Promise<boolean>;
  selectFolder(): Promise<string | null>;
  
  // Notifications
  notify(message: string, level?: 'info' | 'warning' | 'error'): void;
}

/**
 * Trait for adapters that support advanced workspace operations
 */
export interface WorkspaceStorage {
  scanWorkspaceStatus(): Promise<'loaded' | 'notDetected' | 'noWorkspace'>;
  syncRecentPlans(plans: any[]): Promise<void>;
  startProgress(id: string, message: string): void;
  stopProgress(id: string): void;
}

/**
 * Trait for adapters that can bridge internal notifications to external handlers
 */
export interface NotifyStorage {
  setNotifyHandler(handler: (message: string, level: string) => void): void;
}

export function isWorkspaceStorage(storage: any): storage is WorkspaceStorage {
  return storage && typeof storage.scanWorkspaceStatus === 'function';
}

export function isNotifyStorage(storage: any): storage is NotifyStorage {
  return storage && typeof storage.setNotifyHandler === 'function';
}
