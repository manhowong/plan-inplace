import * as vscode from 'vscode';

export type NotificationLevel = 'info' | 'warning' | 'error';
const progressResolvers = new Map<string, () => void>();

export function notify(message: string, level: NotificationLevel = 'info'): Thenable<string | undefined> {
  if (level === 'error') {
    return vscode.window.showErrorMessage(message);
  }
  if (level === 'warning') {
    return vscode.window.showWarningMessage(message);
  }
  return vscode.window.showInformationMessage(message);
}

export function startProgressNotification(id: string, message: string): void {
  if (progressResolvers.has(id)) return;

  void vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: message,
      cancellable: false
    },
    () => new Promise<void>((resolve) => {
      progressResolvers.set(id, resolve);
    })
  );
}

export function stopProgressNotification(id: string): void {
  const resolve = progressResolvers.get(id);
  if (!resolve) return;
  progressResolvers.delete(id);
  resolve();
}
