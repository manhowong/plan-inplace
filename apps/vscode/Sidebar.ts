import * as path from 'path';
import * as vscode from 'vscode';
import { getSidebarTemplate } from './sidebarTemplate';
import { getNonce } from './utils';
import { createPlanFilesWatcher } from './services/fileWatcher';
import { getPlanFolder, getWorkspaceFolder } from './services/folderLookup';
import * as fileOps from './services/fileOperations';
import { notify, startProgressNotification, stopProgressNotification } from './services/notifier';
import { UI_MESSAGES } from '../../packages/types/messages';

export class Sidebar implements vscode.WebviewViewProvider {
  public static readonly viewType = 'plan-inplace.mainView';

  private _view?: vscode.WebviewView;
  private _watcher?: vscode.FileSystemWatcher;
  private _openStatusShown = false;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _openMainView: (planId?: string) => void
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };
    this._updateWebview();

/* -------------------------------------------------------------------------- */
/* Webview Message Handlers                                                 */
/* -------------------------------------------------------------------------- */

    webviewView.webview.onDidReceiveMessage(async data => {
      switch (data.type) {
        case 'openApp':
          this._openMainView();
          break;
        case 'openTask':
          this._openMainView(data.taskId);
          break;
        case 'createPlan':
          await this._createPlan();
          break;
        case 'addTask':
          await this._addTask(data.title);
          break;
        case 'completeTask':
          await this._toggleComplete(data.taskId);
          break;
        case 'deleteTask': {
          const confirmDelete = await vscode.window.showWarningMessage(
            UI_MESSAGES.CONFIRMATIONS.DELETE_TASK.message('this task'),
            { modal: true },
            UI_MESSAGES.CONFIRMATIONS.DELETE_TASK.confirmLabel
          );
          if (confirmDelete === UI_MESSAGES.CONFIRMATIONS.DELETE_TASK.confirmLabel) {
            await this._deleteTask(data.taskId);
          }
          break;
        }
        case 'clearArchived': {
          const confirmClear = await vscode.window.showWarningMessage(
            UI_MESSAGES.CONFIRMATIONS.DELETE_ARCHIVE.message('all' as any).replace('all archived', 'archived'), // Adjusted for extension view context
            { modal: true },
            UI_MESSAGES.CONFIRMATIONS.DELETE_ARCHIVE.confirmLabel
          );
          if (confirmClear === UI_MESSAGES.CONFIRMATIONS.DELETE_ARCHIVE.confirmLabel) {
            await this._clearArchived();
          }
          break;
        }
        case 'refresh':
          await this.refreshData();
          break;
      }
    });

    this._setupWatcher();
    this.refreshData();
    this._notifyOpenStatus();
  }

  private async _notifyOpenStatus() {
    if (this._openStatusShown) return;
    this._openStatusShown = true;

    const progressId = `sidebar-scan-${Date.now()}`;
    startProgressNotification(progressId, UI_MESSAGES.VSCODE_NOTIFICATIONS.SCANNING_WORKSPACE);

    const workspaceFolder = await getWorkspaceFolder();
    if (!workspaceFolder) {
      stopProgressNotification(progressId);
      return;
    }

    const folder = await getPlanFolder(workspaceFolder);
    if (!folder) {
      stopProgressNotification(progressId);
      notify(UI_MESSAGES.VSCODE_NOTIFICATIONS.NOT_DETECTED_WORKSPACE, 'warning');
      return;
    }

    try {
      await fileOps.readTasks(folder);
      stopProgressNotification(progressId);
      notify(UI_MESSAGES.VSCODE_NOTIFICATIONS.LOAD_SUCCESS, 'info');
    } catch {
      stopProgressNotification(progressId);
      notify(UI_MESSAGES.VSCODE_NOTIFICATIONS.NOT_DETECTED_WORKSPACE, 'warning');
    }
  }

  public async refreshData() {
    if (!this._view) return;
    const workspaceFolder = await getWorkspaceFolder();
    if (!workspaceFolder) {
      this._view.webview.postMessage({ type: 'setData', state: 'noWorkspace' });
      return;
    }

    const folder = await getPlanFolder(workspaceFolder);
    if (!folder) {
      this._view.webview.postMessage({
        type: 'setData',
        state: 'noPlan',
        location: workspaceFolder.fsPath,
        relativeLocation: vscode.workspace.asRelativePath(workspaceFolder.fsPath, false)
      });
      return;
    }

    try {
      const tasks = await fileOps.readTasks(folder);
      
      const folderName = path.basename(folder.fsPath);
      const fallbackName = folderName === 'plan-inplace' ? path.basename(workspaceFolder.fsPath) : folderName;
      const { name: planName } = await fileOps.readMetadata(folder, fallbackName);

      this._view.webview.postMessage({
        type: 'setData',
        state: 'hasPlan',
        tasks,
        planName,
        location: folder.fsPath,
        relativeLocation: vscode.workspace.asRelativePath(workspaceFolder.fsPath, false)
      });
    } catch {
      this._view.webview.postMessage({
        type: 'setData',
        state: 'noPlan',
        location: workspaceFolder.fsPath,
        relativeLocation: vscode.workspace.asRelativePath(workspaceFolder.fsPath, false)
      });
    }
  }

  private _updateWebview() {
    if (!this._view) return;
    this._view.webview.html = getSidebarTemplate(getNonce());
  }

  private async _setupWatcher() {
    const workspaceFolder = await getWorkspaceFolder();
    if (!workspaceFolder) return;
    const folder = await getPlanFolder(workspaceFolder);
    if (!folder) return;

    this._watcher?.dispose();
    this._watcher = createPlanFilesWatcher(folder, () => this.refreshData());
  }

/* -------------------------------------------------------------------------- */
/* Handlers: Plan Data Operations                                           */
/* -------------------------------------------------------------------------- */

  private async _createPlan() {
    const workspace = await getWorkspaceFolder();
    if (!workspace) {
      notify(UI_MESSAGES.ERRORS.VSCODE_NO_WORKSPACE, 'error');
      return;
    }
    try {
      const message = await fileOps.createPlan(workspace);
      notify(message, 'info');
      await this._setupWatcher();
      this.refreshData();
    } catch {
      notify(UI_MESSAGES.ERRORS.VSCODE_CREATE_FAILED, 'error');
    }
  }

  private async _addTask(title: string) {
    const workspace = await getWorkspaceFolder();
    const folder = workspace ? await getPlanFolder(workspace) : undefined;
    if (!folder) return;
    try {
      await fileOps.addTask(folder, title);
      this.refreshData();
    } catch {
      notify(UI_MESSAGES.ERRORS.VSCODE_ADD_TASK_FAILED, 'error');
    }
  }

  private async _toggleComplete(taskId: string) {
    const workspace = await getWorkspaceFolder();
    const folder = workspace ? await getPlanFolder(workspace) : undefined;
    if (!folder) return;
    try {
      await fileOps.toggleComplete(folder, taskId);
      this.refreshData();
    } catch {
      notify(UI_MESSAGES.ERRORS.VSCODE_UPDATE_STATUS_FAILED, 'error');
    }
  }

  private async _deleteTask(taskId: string) {
    const workspace = await getWorkspaceFolder();
    const folder = workspace ? await getPlanFolder(workspace) : undefined;
    if (!folder) return;
    try {
      await fileOps.deleteTask(folder, taskId);
      this.refreshData();
    } catch {
      notify(UI_MESSAGES.ERRORS.VSCODE_DELETE_TASK_FAILED, 'error');
    }
  }

  private async _clearArchived() {
    const workspace = await getWorkspaceFolder();
    const folder = workspace ? await getPlanFolder(workspace) : undefined;
    if (!folder) return;
    try {
      await fileOps.clearArchived(folder);
      this.refreshData();
    } catch {
      notify(UI_MESSAGES.ERRORS.VSCODE_CLEAR_ARCHIVE_FAILED, 'error');
    }
  }
}
