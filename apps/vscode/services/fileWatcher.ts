import * as vscode from 'vscode';

export function createPlanFilesWatcher(
  folder: vscode.Uri,
  onChange: () => void
): vscode.FileSystemWatcher {
  const pattern = new vscode.RelativePattern(folder, '{plan.json,metadata.json}');
  const watcher = vscode.workspace.createFileSystemWatcher(pattern);
  watcher.onDidChange(onChange);
  watcher.onDidCreate(onChange);
  watcher.onDidDelete(onChange);
  return watcher;
}
