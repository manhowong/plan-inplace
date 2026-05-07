import * as vscode from 'vscode';
import * as path from 'path';
import {
  createInitialPlan,
  createNewTask,
  parseMetadata,
  parseTasks,
  prepareMetadataPayload,
  removeArchivedTasks,
  removeTaskById,
  toggleTaskArchived
} from '../../../packages/core/logic';
import { DEFAULT_PLAN_CONFIG as DEFAULT_CONFIG } from '../../../packages/core/config';
import { Task } from '../../../packages/types/shared';

import { UI_MESSAGES } from '../../../packages/types/messages';

/* -------------------------------------------------------------------------- */
/* Basic I/O: Tasks & Metadata                                               */
/* -------------------------------------------------------------------------- */

export async function readTasks(folder: vscode.Uri): Promise<Task[]> {
  const planUri = vscode.Uri.joinPath(folder, 'plan.json');
  const content = await vscode.workspace.fs.readFile(planUri);
  return parseTasks(Buffer.from(content).toString('utf8'));
}

export async function writeTasks(folder: vscode.Uri, tasks: Task[]): Promise<void> {
  const planUri = vscode.Uri.joinPath(folder, 'plan.json');
  await vscode.workspace.fs.writeFile(
    planUri,
    Buffer.from(JSON.stringify({ tasks }, null, 2), 'utf8')
  );
}

export async function readMetadata(folder: vscode.Uri, fallbackName: string): Promise<any> {
  try {
    const metadataUri = vscode.Uri.joinPath(folder, 'metadata.json');
    const content = await vscode.workspace.fs.readFile(metadataUri);
    return parseMetadata(Buffer.from(content).toString('utf8'), fallbackName);
  } catch {
    return {
      name: fallbackName,
      config: DEFAULT_CONFIG,
      plan: { name: fallbackName }
    };
  }
}

/* -------------------------------------------------------------------------- */
/* High-level Operations: CRUD Actions                                       */
/* -------------------------------------------------------------------------- */

export async function createPlan(workspace: vscode.Uri): Promise<string> {
  const planFolder = vscode.Uri.joinPath(workspace, 'plan-inplace');
  await vscode.workspace.fs.createDirectory(planFolder);

  const { plan, config } = createInitialPlan(path.basename(workspace.fsPath));

  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(planFolder, 'plan.json'),
    Buffer.from(JSON.stringify({ tasks: [] }, null, 2), 'utf8')
  );

  const metadata = prepareMetadataPayload({}, config, plan);
  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(planFolder, 'metadata.json'),
    Buffer.from(JSON.stringify(metadata, null, 2), 'utf8')
  );

  return UI_MESSAGES.VSCODE_NOTIFICATIONS.PLAN_CREATED(path.basename(workspace.fsPath));
}

export async function addTask(folder: vscode.Uri, title: string): Promise<void> {
  const tasks = await readTasks(folder);
  const { config } = await readMetadata(folder, path.basename(folder.fsPath));
  const newTask = createNewTask(title, config, tasks as any);
  tasks.unshift(newTask as any);
  await writeTasks(folder, tasks);
}

export async function toggleComplete(folder: vscode.Uri, taskId: string): Promise<void> {
  const tasks = await readTasks(folder);
  const updatedTasks = toggleTaskArchived(tasks, taskId);
  await writeTasks(folder, updatedTasks);
}

export async function deleteTask(folder: vscode.Uri, taskId: string): Promise<void> {
  const tasks = await readTasks(folder);
  const updatedTasks = removeTaskById(tasks, taskId);
  await writeTasks(folder, updatedTasks);
}

export async function clearArchived(folder: vscode.Uri): Promise<void> {
  const tasks = await readTasks(folder);
  const updatedTasks = removeArchivedTasks(tasks);
  await writeTasks(folder, updatedTasks);
}

export async function listFiles(folder: vscode.Uri): Promise<Array<{ name: string; content: string }>> {
  const files: { name: string; content: string }[] = [];
  const entries = await vscode.workspace.fs.readDirectory(folder);
  for (const [name, type] of entries) {
    if (type === vscode.FileType.File) {
      const content = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(folder, name));
      files.push({ name, content: Buffer.from(content).toString('utf8') });
    }
  }
  return files;
}

export async function writeFile(folder: vscode.Uri, name: string, content: string): Promise<void> {
  await vscode.workspace.fs.createDirectory(folder);
  await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(folder, name), Buffer.from(content, 'utf8'));
}

export async function deleteFile(folder: vscode.Uri, name: string): Promise<void> {
  await vscode.workspace.fs.delete(vscode.Uri.joinPath(folder, name));
}

export async function clearPlanData(folder: vscode.Uri): Promise<void> {
  await vscode.workspace.fs.delete(folder, { recursive: true });
}
