import { StorageManager, NotifyStorage } from './base';
import { ROOT_FOLDER_NAME, METADATA_FILE } from '@packages/core/config';

export class BrowserStorage implements StorageManager, NotifyStorage {
  type: 'browser' = 'browser';
  private directoryHandle: FileSystemDirectoryHandle | null = null;
  private updateCallbacks: (() => void)[] = [];
  private notifyHandler: ((message: string, level: string) => void) | null = null;

  setNotifyHandler(handler: (message: string, level: string) => void) {
    this.notifyHandler = handler;
  }

  isSupported(): boolean {
    return 'showDirectoryPicker' in window;
  }

  async hasPermission(): Promise<boolean> {
    if (!this.directoryHandle) return false;
    const status = await (this.directoryHandle as any).queryPermission({ mode: 'readwrite' });
    return status === 'granted';
  }

  async requestPermission(): Promise<boolean> {
    try {
      this.directoryHandle = await (window as any).showDirectoryPicker({
        mode: 'readwrite',
      });
      return true;
    } catch (e) {
      console.error('Permission request failed:', e);
      return false;
    }
  }

  setDirectoryHandle(handle: FileSystemDirectoryHandle) {
    this.directoryHandle = handle;
  }

  getDirectoryHandle(): FileSystemDirectoryHandle | null {
    return this.directoryHandle;
  }

  /**
   * Data Isolation Strategy
   * --------------------------------------------------------------------------
   * To prevent polluting the user's root folder, all Plan InPlace data is stored
   * inside a dedicated subfolder. This method ensures we 
   * either find or create that folder before performing operations.
   */
  private async getPlanFolder(create = false): Promise<FileSystemDirectoryHandle | null> {
    if (!this.directoryHandle) return null;
    
    // The user's requirement is that we must USE a Plan InPlace subfolder.
    // If the directoryHandle itself is named ROOT_FOLDER_NAME, we are ALREADY in the right place.
    if (this.directoryHandle.name === ROOT_FOLDER_NAME) {
      return this.directoryHandle;
    }

    try {
      return await this.directoryHandle.getDirectoryHandle(ROOT_FOLDER_NAME, { create });
    } catch (e) {
      return null;
    }
  }

  async getFiles(): Promise<{ name: string; content: string }[]> {
    const planFolder = await this.getPlanFolder();
    if (!planFolder) return [];
    
    const files: { name: string; content: string }[] = [];
    for await (const entry of (planFolder as any).values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        const content = await file.text();
        files.push({ name: entry.name, content });
      }
    }
    return files;
  }

  async listFiles(): Promise<string[]> {
    const planFolder = await this.getPlanFolder();
    if (!planFolder) return [];
    
    const names: string[] = [];
    for await (const entry of (planFolder as any).values()) {
      if (entry.kind === 'file') {
        names.push(entry.name);
      }
    }
    return names;
  }

  async readFile(name: string): Promise<string | null> {
    const planFolder = await this.getPlanFolder();
    if (!planFolder) return null;
    try {
      const fileHandle = await planFolder.getFileHandle(name);
      const file = await fileHandle.getFile();
      return await file.text();
    } catch (e) {
      return null;
    }
  }

  async writeFile(name: string, content: string): Promise<void> {
    if (!this.directoryHandle) return;
    try {
      const planFolder = await this.getPlanFolder(true);
      if (!planFolder) throw new Error('Could not access plan-inplace folder');
      
      const fileHandle = await planFolder.getFileHandle(name, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      this.notifyUpdate();
    } catch (e) {
      console.error(`Failed to write file: ${name}`, e);
      throw e;
    }
  }

  async deleteFile(name: string): Promise<void> {
    const planFolder = await this.getPlanFolder();
    if (!planFolder) return;
    try {
      await planFolder.removeEntry(name);
      this.notifyUpdate();
    } catch (e) {
      console.error(`Failed to delete file: ${name}`, e);
      throw e;
    }
  }

  async clearPlanData(): Promise<void> {
    if (!this.directoryHandle) return;
    try {
      const planFolder = await this.getPlanFolder();
      if (planFolder) {
        await this.directoryHandle.removeEntry(ROOT_FOLDER_NAME, { recursive: true });
      }
      this.notifyUpdate();
    } catch (e) {
      console.error('Failed to clear plan data:', e);
      throw e;
    }
  }

  getDirectoryName(): string {
    return this.directoryHandle?.name || ROOT_FOLDER_NAME;
  }

  getDirectoryPath(): string {
    return `[Local] ${this.directoryHandle?.name || ROOT_FOLDER_NAME}`;
  }

  onUpdate(callback: () => void): void {
    this.updateCallbacks.push(callback);
  }

  private notifyUpdate() {
    this.updateCallbacks.forEach(cb => cb());
  }
  
  async hasEntry(name: string): Promise<boolean> {
    if (!this.directoryHandle) return false;
    try {
      await this.directoryHandle.getDirectoryHandle(name);
      return true;
    } catch (e) {
      try {
        await this.directoryHandle.getFileHandle(name);
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  async openBookmark(plan: any): Promise<boolean> {
    if (!plan.handle) return false;

    try {
      const status = await (plan.handle as any).requestPermission({ mode: 'readwrite' });
      
      if (status === 'granted') {
        // Double check existence (metadata.json probe)
        let foundMeta = false;
        // First check if the folder itself is plan-inplace
        if (plan.handle.name === ROOT_FOLDER_NAME) {
            try {
              await plan.handle.getFileHandle(METADATA_FILE, { create: false });
              foundMeta = true;
            } catch (e) {}
        } else {
            // Otherwise look for subfolder
            try {
              const planFolder = await plan.handle.getDirectoryHandle(ROOT_FOLDER_NAME, { create: false });
              await planFolder.getFileHandle(METADATA_FILE, { create: false });
              foundMeta = true;
            } catch (subE) {}
        }
        
        if (!foundMeta) return false;

        this.setDirectoryHandle(plan.handle);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async registerPlan(id: string, name: string): Promise<void> {
    if (!this.directoryHandle) return;
    
    // We import bookmark functions dynamically to avoid circular dependencies if any,
    // though here it should be fine.
    const { addRecentPlan, setLastPlanId } = await import('../bookmarkManager');
    await addRecentPlan({
      id,
      name,
      handle: this.directoryHandle
    });
    await setLastPlanId(id);
  }

  async selectFolder(): Promise<string | null> {
    try {
      const handle = await (window as any).showDirectoryPicker({ mode: 'readwrite' });
      this.setDirectoryHandle(handle);
      return handle.name;
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        throw e;
      }
      return null;
    }
  }

  notify(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (this.notifyHandler) {
      this.notifyHandler(message, level);
    } else {
      if (level === 'error') console.error(message);
      else if (level === 'warning') console.warn(message);
      else console.log(message);
    }
  }
}
