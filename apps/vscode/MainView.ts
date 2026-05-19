import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { escapeHtml, getNonce } from './utils';
import { createPlanFilesWatcher } from './services/fileWatcher';
import { getPlanFolder, getWorkspaceFolder } from './services/folderLookup';
import * as fileOps from './services/fileOperations';
import { notify, NotificationLevel, startProgressNotification, stopProgressNotification } from './services/notifier';
import { UI_MESSAGES } from '../../packages/types/messages';

export class MainView {
  public static currentPanel: MainView | undefined;
  public static readonly viewType = 'plan-inplace';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _currentFolder: vscode.Uri | undefined;
  private _watcher: vscode.FileSystemWatcher | undefined;
  private _jumpModuleRetries: NodeJS.Timeout[] = [];

  public static createOrShow(extensionUri: vscode.Uri, planId?: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (MainView.currentPanel) {
      MainView.currentPanel._panel.reveal(column);
      if (planId === '__open_settings__') {
        void MainView.currentPanel._openWorkspacePlan().then(() => {
          MainView.currentPanel?._postJumpToModule('settings');
        });
      } else if (planId) {
        MainView.currentPanel._panel.webview.postMessage({ type: 'jumpToPlan', id: planId });
      }
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      MainView.viewType,
      'Plan InPlace',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')]
      }
    );

    MainView.currentPanel = new MainView(panel, extensionUri, planId);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, initialPlanId?: string) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._update();

    if (initialPlanId === '__open_settings__') {
      void this._openWorkspacePlan().then(() => this._postJumpToModule('settings'));
    } else if (initialPlanId) {
      this._panel.webview.postMessage({ type: 'jumpToPlan', id: initialPlanId });
    }

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.onDidReceiveMessage(async message => {
      switch (message.type) {
        case 'getFiles':
          this._sendFiles();
          return;
        case 'openFolder':
          if (message.path) {
            this._currentFolder = vscode.Uri.file(message.path);
            await this._sendFiles();
            this._panel.webview.postMessage({ type: 'update' });
          }
          return;
        case 'writeFile':
          await this._writeFile(message.name, message.content);
          return;
        case 'deleteFile':
          await this._deleteFile(message.name);
          return;
        case 'clearPlanData':
          await this._clearPlanData();
          return;
        case 'selectFolder':
          await this._selectFolder();
          return;
        case 'selectImportConfigFile':
          await this._selectImportConfigFile();
          return;
        case 'triggerScanning':
          notify(UI_MESSAGES.VSCODE_NOTIFICATIONS.SCANNING_WORKSPACE, 'info');
          return;
        case 'notify':
          if (message.message) {
            notify(message.message, (message.level || 'info') as NotificationLevel);
          }
          return;
        case 'notifyProgress':
          if (message.action === 'start' && message.id && message.message) {
            startProgressNotification(message.id, message.message);
          } else if (message.action === 'stop' && message.id) {
            stopProgressNotification(message.id);
          }
          return;
        case 'scanWorkspace':
          await this._handleScanWorkspace();
          return;
        case 'hasEntry':
          await this._handleHasEntry(message.name);
          return;
      }
    }, null, this._disposables);
  }

  private async _openWorkspacePlan() {
    this._currentFolder = undefined;
    await this._sendFiles();
    this._panel.webview.postMessage({ type: 'update' });
  }

  private async _resolveBaseFolder(): Promise<vscode.Uri | undefined> {
    return this._currentFolder || await getWorkspaceFolder();
  }

  private async _resolvePlanFolder(create = false): Promise<vscode.Uri | undefined> {
    const baseFolder = await this._resolveBaseFolder();
    if (!baseFolder) return undefined;
    return getPlanFolder(baseFolder, create);
  }

  private async _setupWatcher(folder: vscode.Uri) {
    this._watcher?.dispose();
    this._watcher = createPlanFilesWatcher(folder, () => this._panel.webview.postMessage({ type: 'update' }));
    this._disposables.push(this._watcher);
  }

  private async _selectFolder() {
    const folderUri = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: 'Select Plan Folder'
    });
    if (folderUri && folderUri[0]) {
      this._currentFolder = folderUri[0];
      this._panel.webview.postMessage({ type: 'folderSelected', path: this._currentFolder.fsPath });
      this._sendFiles();
    } else {
      this._panel.webview.postMessage({ type: 'folderSelected', path: null });
    }
  }

  private async _selectImportConfigFile() {
    const fileUri = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: 'Select metadata.json',
      filters: {
        JSON: ['json']
      }
    });

    if (!fileUri || !fileUri[0]) {
      this._panel.webview.postMessage({ type: 'importConfigFileSelected', content: null });
      return;
    }

    try {
      const bytes = await vscode.workspace.fs.readFile(fileUri[0]);
      const content = Buffer.from(bytes).toString('utf8');
      this._panel.webview.postMessage({ type: 'importConfigFileSelected', content });
    } catch {
      this._panel.webview.postMessage({ type: 'importConfigFileSelected', content: null });
    }
  }

  private async _sendFiles() {
    const baseFolder = await this._resolveBaseFolder();
    if (!baseFolder) {
      this._panel.webview.postMessage({ type: 'files', files: [] });
      return;
    }

    const folder = await this._resolvePlanFolder();
    if (!folder) {
      this._panel.webview.postMessage({ type: 'files', files: [], workspacePath: baseFolder.fsPath });
      return;
    }

    await this._setupWatcher(folder);

    try {
      const files = await fileOps.listFiles(folder);
      this._panel.webview.postMessage({ type: 'files', files, workspacePath: baseFolder.fsPath });
    } catch {
      this._panel.webview.postMessage({ type: 'files', files: [], workspacePath: baseFolder.fsPath });
    }
  }

  private async _writeFile(name: string, content: string) {
    const folder = await this._resolvePlanFolder(true);
    if (!folder) return;
    try {
      await fileOps.writeFile(folder, name, content);
      this._panel.webview.postMessage({ type: 'update' });
    } catch {
      notify(UI_MESSAGES.ERRORS.VSCODE_WRITE_FILE_FAILED(name), 'error');
    }
  }

  private async _deleteFile(name: string) {
    const folder = await this._resolvePlanFolder();
    if (!folder) return;
    try {
      await fileOps.deleteFile(folder, name);
      this._panel.webview.postMessage({ type: 'update' });
    } catch {
      notify(UI_MESSAGES.ERRORS.VSCODE_DELETE_FILE_FAILED(name), 'error');
    }
  }

  private async _clearPlanData() {
    const folder = await this._resolvePlanFolder();
    if (!folder) return;
    try {
      await fileOps.clearPlanData(folder);
      this._panel.webview.postMessage({ type: 'update' });
    } catch {
      notify(UI_MESSAGES.ERRORS.VSCODE_CLEAR_DATA_FAILED, 'error');
    }
  }

  private async _handleHasEntry(name: string) {
    if (name === 'plan-inplace') {
      const folder = await this._resolvePlanFolder();
      this._panel.webview.postMessage({ type: 'hasEntryResponse', name, exists: !!folder });
      return;
    }
    const folder = await this._resolvePlanFolder();
    if (!folder) {
      this._panel.webview.postMessage({ type: 'hasEntryResponse', name, exists: false });
      return;
    }
    try {
      await vscode.workspace.fs.stat(vscode.Uri.joinPath(folder, name));
      this._panel.webview.postMessage({ type: 'hasEntryResponse', name, exists: true });
    } catch {
      this._panel.webview.postMessage({ type: 'hasEntryResponse', name, exists: false });
    }
  }

  private async _handleScanWorkspace() {
    const baseFolder = await this._resolveBaseFolder();
    if (!baseFolder) {
      this._panel.webview.postMessage({ type: 'scanWorkspaceResponse', status: 'noWorkspace' });
      return;
    }

    const folder = await this._resolvePlanFolder();
    if (!folder) {
      this._panel.webview.postMessage({ type: 'scanWorkspaceResponse', status: 'notDetected' });
      return;
    }

    try {
      await fileOps.readTasks(folder);
      this._panel.webview.postMessage({ type: 'scanWorkspaceResponse', status: 'loaded' });
    } catch {
      this._panel.webview.postMessage({ type: 'scanWorkspaceResponse', status: 'notDetected' });
    }
  }

  public dispose() {
    MainView.currentPanel = undefined;
    this._clearJumpModuleTimers();
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      x?.dispose();
    }
  }

  private _update() {
    this._panel.webview.html = this._getHtmlForWebview();
  }

  private _clearJumpModuleTimers() {
    this._jumpModuleRetries.forEach(t => clearTimeout(t));
    this._jumpModuleRetries = [];
  }

  private _postJumpToModule(module: 'settings') {
    this._clearJumpModuleTimers();
    const delays = [0, 250, 700, 1400];
    delays.forEach(delay => {
      const timer = setTimeout(() => {
        this._panel.webview.postMessage({ type: 'jumpToModule', module });
      }, delay);
      this._jumpModuleRetries.push(timer);
    });
  }

  private _getHtmlForWebview() {
    const webview = this._panel.webview;
    const nonce = getNonce();
    const distPath = vscode.Uri.joinPath(this._extensionUri, 'dist');
    const indexPath = path.join(distPath.fsPath, 'app.html');

    try {
      if (!fs.existsSync(indexPath)) {
        throw new Error('Missing dist/app.html. Build the web app before opening Plan InPlace.');
      }
      let html = fs.readFileSync(indexPath, 'utf8');
      const baseUri = webview.asWebviewUri(distPath);
      const cspSource = webview.cspSource;
      const webviewUri = baseUri.toString();
      const baseTag = `<base href="${webviewUri}/">`;
      // Use only cspSource in CSP - it handles vscode-resource URIs correctly
      const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${cspSource} https: data:; script-src ${cspSource} 'nonce-${nonce}' 'unsafe-eval'; style-src ${cspSource} 'unsafe-inline' https:; font-src ${cspSource} https: data:;">`;
      const scriptInjection = `
        <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
            window.vscode = vscode;
        </script>
      `;

      html = html.replace(/(href|src)="\//g, '$1="');
      html = html.replace(/ crossorigin/g, '');
      html = html.replace(/<script /g, `<script nonce="${nonce}" `);
      html = html.replace(/<link[^>]+rel="manifest"[^>]*>/g, '');
      html = html.replace('<head>', `<head>${csp}${baseTag}`);
      html = html.replace('<body>', `<body>${scriptInjection}`);
      return html;
    } catch (error) {
      const message = escapeHtml(String(error));
      return `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
          <title>Plan InPlace</title>
        </head>
        <body>
          <p>Failed to load Plan InPlace web app: ${message}</p>
          <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
            window.vscode = vscode;
          </script>
        </body>
        </html>`;
    }
  }
}
