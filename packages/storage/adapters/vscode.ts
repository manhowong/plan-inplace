import { StorageManager, WorkspaceStorage } from './base';
import { ROOT_FOLDER_NAME } from '@packages/core/config';

declare const acquireVsCodeApi: any;

export class VSCodeStorage implements StorageManager, WorkspaceStorage {
  type: 'vscode' = 'vscode';
  private vscode: any = null;
  private updateCallbacks: (() => void)[] = [];
  private workspacePath: string = 'workspace';

  constructor() {
    try {
      // Check if it was already acquired and injected by the extension host
      if ((window as any).vscode) {
        this.vscode = (window as any).vscode;
      } else {
        this.vscode = acquireVsCodeApi();
      }

      window.addEventListener('message', event => {
        const message = event.data;
        if (message.type === 'update') {
          this.notifyUpdate();
        }
        if (message.workspacePath) {
          this.workspacePath = message.workspacePath;
        }
        if (message.type === 'jumpToPlan') {
          // Send a message that looks like openFolder to trigger the internal refresh logic
          // but we can also just use this to trigger an update notify
          this.vscode.postMessage({ type: 'openFolder', id: message.id, path: message.id });
        }
        if (message.type === 'jumpToModule') {
          window.dispatchEvent(new CustomEvent('plan-inplace-jump-module', { detail: message.module }));
        }
      });
    } catch (e) {
      // Not in VS Code
    }
  }

  isSupported(): boolean {
    return !!this.vscode;
  }

  async hasPermission(): Promise<boolean> {
    return !!this.vscode;
  }

  async requestPermission(): Promise<boolean> {
    const path = await this.selectFolder();
    return !!path;
  }

  async getFiles(): Promise<{ name: string; content: string }[]> {
    if (!this.vscode) return [];
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === 'files') {
          window.removeEventListener('message', handler);
          resolve(event.data.files);
        }
      };
      window.addEventListener('message', handler);
      this.vscode.postMessage({ type: 'getFiles' });
    });
  }

  async listFiles(): Promise<string[]> {
    const files = await this.getFiles();
    return files.map(f => f.name);
  }

  async readFile(name: string): Promise<string | null> {
    const files = await this.getFiles();
    const file = files.find(f => f.name === name);
    return file ? file.content : null;
  }

  async writeFile(name: string, content: string): Promise<void> {
    if (!this.vscode) return;
    this.vscode.postMessage({ type: 'writeFile', name, content });
  }

  async deleteFile(name: string): Promise<void> {
    if (!this.vscode) return;
    this.vscode.postMessage({ type: 'deleteFile', name });
  }

  async selectFolder(): Promise<string | null> {
    if (!this.vscode) return null;
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === 'folderSelected') {
          window.removeEventListener('message', handler);
          resolve(event.data.path);
        }
      };
      window.addEventListener('message', handler);
      this.vscode.postMessage({ type: 'selectFolder' });
    });
  }

  async clearPlanData(): Promise<void> {
    if (!this.vscode) return;
    this.vscode.postMessage({ type: 'clearPlanData' });
  }

  async registerPlan(id: string, name: string): Promise<void> {
    if (!this.vscode) return;

    // Notify extension
    this.vscode.postMessage({ type: 'saveRecentPlans', plans: [{ id, name, path: this.workspacePath }] });
    
    // Update local bookmarks
    const { addRecentPlan, setLastPlanId } = await import('../bookmarkManager');
    await addRecentPlan({
      id,
      name,
      path: this.workspacePath
    });
    await setLastPlanId(id);
  }

  async openBookmark(plan: any): Promise<boolean> {
    if (!this.vscode) return false;
    this.vscode.postMessage({ type: 'openFolder', id: plan.id, path: plan.path || plan.id });
    return true;
  }

  async syncRecentPlans(plans: any[]): Promise<void> {
    if (!this.vscode) return;
    this.vscode.postMessage({ type: 'saveRecentPlans', plans });
  }

  notify(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!this.vscode) return;
    this.vscode.postMessage({ type: 'notify', message, level });
  }

  startProgress(id: string, message: string): void {
    if (!this.vscode) return;
    this.vscode.postMessage({ type: 'notifyProgress', action: 'start', id, message });
  }

  stopProgress(id: string): void {
    if (!this.vscode) return;
    this.vscode.postMessage({ type: 'notifyProgress', action: 'stop', id });
  }

  getDirectoryName(): string {
    if (!this.workspacePath || this.workspacePath === 'workspace') return ROOT_FOLDER_NAME;
    const parts = this.workspacePath.split(/[\\/]/);
    return parts.filter(Boolean).pop() || 'workspace';
  }

  getDirectoryPath(): string {
    return this.workspacePath;
  }

  onUpdate(callback: () => void): void {
    this.updateCallbacks.push(callback);
  }

  private notifyUpdate() {
    this.updateCallbacks.forEach(cb => cb());
  }
  
  async hasEntry(name: string): Promise<boolean> {
    if (!this.vscode) return false;
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === 'hasEntryResponse' && event.data.name === name) {
          window.removeEventListener('message', handler);
          resolve(event.data.exists);
        }
      };
      window.addEventListener('message', handler);
      this.vscode.postMessage({ type: 'hasEntry', name });
    });
  }

  async scanWorkspaceStatus(): Promise<'loaded' | 'notDetected' | 'noWorkspace'> {
    if (!this.vscode) return 'noWorkspace';
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === 'scanWorkspaceResponse') {
          window.removeEventListener('message', handler);
          resolve(event.data.status);
        }
      };
      window.addEventListener('message', handler);
      this.vscode.postMessage({ type: 'scanWorkspace' });
    });
  }
}
