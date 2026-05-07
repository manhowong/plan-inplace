import * as vscode from 'vscode';

export async function getWorkspaceFolder(): Promise<vscode.Uri | undefined> {
  if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
    return undefined;
  }
  return vscode.workspace.workspaceFolders[0].uri;
}

export async function getPlanFolder(
  baseFolder?: vscode.Uri,
  create = false
): Promise<vscode.Uri | undefined> {
  const base = baseFolder ?? await getWorkspaceFolder();
  if (!base) {
    return undefined;
  }

  const name = 'plan-inplace';
  const sub = vscode.Uri.joinPath(base, name);
  try {
    const stat = await vscode.workspace.fs.stat(sub);
    if (stat.type === vscode.FileType.Directory) {
      return sub;
    }
  } catch (error) {
    // Candidate does not exist or cannot be read; keep probing known locations.
  }

  if (create) {
    const planFolder = vscode.Uri.joinPath(base, 'plan-inplace');
    try {
      await vscode.workspace.fs.createDirectory(planFolder);
      return planFolder;
    } catch {
      return undefined;
    }
  }

  return undefined;
}
