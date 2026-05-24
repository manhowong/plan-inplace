import { isToday, isTomorrow, isPast, startOfDay } from 'date-fns';
import { Task, PlanConfig, PlanMetadata } from '@packages/types/shared';
import { version as APP_VERSION } from '../../package.json';
import { INITIAL_RANK, GAP, DEFAULT_PLAN_CONFIG, ROOT_FOLDER_NAME } from './config';

// --------------------------------------------------------------------------
// Ranking Logic
// --------------------------------------------------------------------------

export function generateInitialRank(): number {
  return INITIAL_RANK;
}

export function getNextRank(prev: number | null, next: number | null): number {
  if (prev === null && next === null) return INITIAL_RANK;
  if (prev === null) return Math.round(next! - GAP);
  if (next === null) return Math.round(prev + GAP);

  const avg = (prev + next) / 2;
  const rounded = Math.round(avg);

  if (rounded === prev || rounded === next) {
    if (next - prev > 1) {
      return prev + 1;
    }
    return avg; 
  }

  return rounded;
}

export function createNewTask(title: string, config: PlanConfig, existingTasks: Task[]): Task {
  const sortedTasks = [...existingTasks].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  const firstTask = sortedTasks[0];
  const rank = getNextRank(null, firstTask?.rank ?? null);

  const newTask: any = {
    id: crypto.randomUUID(),
    title: title,
    priority: 'Unassigned',
    tags: [],
    dueDate: '',
    content: '',
    archived: false,
    rank: rank
  };

  if (config.customFields) {
    config.customFields.forEach(field => {
      if (field.type === 'select' && field.options && field.options.length > 0) {
        if (newTask[field.id] === undefined) {
          newTask[field.id] = field.options[0].id;
        }
      } else {
        if (newTask[field.id] === undefined) {
          newTask[field.id] = '';
        }
      }
    });
  }

  return newTask as Task;
}

// --------------------------------------------------------------------------
// Date Formatting
// --------------------------------------------------------------------------

export function formatDate(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString();
}

export function formatTaskDate(date: string | Date, isArchived?: boolean): { text: string; colorClass: string } {
  if (!date) return { text: '', colorClass: '' };
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return { text: '', colorClass: '' };

  const taskDate = startOfDay(d);

  if (!isArchived) {
    if (isToday(taskDate)) {
      return { text: 'Today', colorClass: 'text-priority-high font-bold' };
    }
    if (isTomorrow(taskDate)) {
      return { text: 'Tomorrow', colorClass: 'text-text-primary font-medium' };
    }
    if (isPast(taskDate)) {
      return { text: 'Overdue', colorClass: 'text-priority-high font-bold' };
    }
  }

  return { text: d.toLocaleDateString(), colorClass: '' };
}

// --------------------------------------------------------------------------
// Storage & Refactoring Logic
// --------------------------------------------------------------------------

export function createInitialPlan(dirName: string): { plan: PlanMetadata, config: PlanConfig } {
  const initialPlan: PlanMetadata = {
    id: `plan_${crypto.randomUUID()}`,
    name: dirName === ROOT_FOLDER_NAME ? ROOT_FOLDER_NAME : dirName,
    notes: '',
    createdAt: new Date().toISOString(),
    appVersion: APP_VERSION
  };

  const initialConfig: PlanConfig = {
    ...DEFAULT_PLAN_CONFIG,
    customFields: DEFAULT_PLAN_CONFIG.customFields.map(f => {
      if (f.id === 'status' && f.options) {
        return {
          ...f,
          options: f.options.map((opt) => ({
            ...opt,
            id: crypto.randomUUID()
          }))
        };
      }
      return f;
    })
  };

  return { plan: initialPlan, config: initialConfig };
}

export function reorderTasks(
  tasks: Task[], 
  taskId: string, 
  field: string, 
  value: string, 
  overId: string | null, 
  position: 'before' | 'after' | 'inside'
): Task[] {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return tasks;

  const movingTask = { ...tasks[taskIndex], [field]: value };
  const otherTasks = tasks.filter(t => t.id !== taskId);
  
  const columnTasks = otherTasks
    .filter(t => (t[field as keyof Task] as unknown as string) === value)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

  let finalTasksInColumn: Task[] = [];

  if (position === 'inside' || overId === null) {
    finalTasksInColumn = [...columnTasks, movingTask];
  } else {
    const overIndex = columnTasks.findIndex(t => t.id === overId);
    if (overIndex === -1) {
      finalTasksInColumn = [...columnTasks, movingTask];
    } else {
      const insertIndex = position === 'before' ? overIndex : overIndex + 1;
      finalTasksInColumn = [...columnTasks];
      finalTasksInColumn.splice(insertIndex, 0, movingTask);
    }
  }

  const reRankedColumn = finalTasksInColumn.map((t, index) => ({
    ...t,
    rank: (index + 1) * GAP
  }));

  const otherColumnTasks = otherTasks.filter(t => (t[field as keyof Task] as unknown as string) !== value);
  return [...otherColumnTasks, ...reRankedColumn];
}

export function sanitizeTasks(tasks: any[]): { tasks: Task[], updated: boolean } {
  let updated = false;
  const sanitized = tasks.map((t: any) => {
    if (typeof t.rank !== 'number') {
      updated = true;
      return { ...t, rank: generateInitialRank() };
    }
    return t;
  });
  return { tasks: sanitized, updated };
}

export function migrateTaskFields(tasks: Task[], oldId: string, newId: string): Task[] {
  return tasks.map(t => {
    if (t[oldId] !== undefined) {
      const newTask = { ...t };
      newTask[newId] = t[oldId];
      delete newTask[oldId];
      return newTask;
    }
    return t;
  });
}

/* -------------------------------------------------------------------------- */
/* Persistence Preparations                                                 */
/* -------------------------------------------------------------------------- */

export function prepareMetadataPayload(existingMetadata: any, config: PlanConfig, plan?: PlanMetadata): any {
  const fileData = { ...existingMetadata };
  fileData.config = config;
  if (plan) {
    fileData.plan = plan;
  }
  fileData.appVersion = APP_VERSION;
  return fileData;
}

export function parseTasks(content: string): Task[] {
  const parsed = JSON.parse(content) as { tasks?: Task[] };
  if (parsed && Array.isArray(parsed.tasks)) {
    return parsed.tasks;
  }
  return [];
}

export function parseMetadata(content: string, fallbackName: string): { id: string, name: string, config: PlanConfig, plan: PlanMetadata, raw: any } {
  const metadata = JSON.parse(content);
  const plan = metadata.plan || {
    id: metadata.id || crypto.randomUUID(),
    name: metadata.name || fallbackName,
    createdAt: new Date().toISOString(),
    appVersion: APP_VERSION
  };
  
  return {
    id: plan.id,
    name: plan.name || metadata.name || fallbackName,
    config: metadata.config || DEFAULT_PLAN_CONFIG,
    plan: plan,
    raw: metadata
  };
}

export function toggleTaskArchived(tasks: Task[], taskId: string): Task[] {
  let targetTask: Task | undefined;
  const remaining = tasks.filter(t => {
    if (t.id === taskId) {
      targetTask = { ...t, archived: !t.archived };
      return false;
    }
    return true;
  });

  if (targetTask) {
    return [targetTask, ...remaining];
  }

  return tasks;
}

export function removeTaskById(tasks: Task[], taskId: string): Task[] {
  return tasks.filter(t => t.id !== taskId);
}

export function removeTasksByIds(tasks: Task[], taskIds: string[]): Task[] {
  return tasks.filter(t => !taskIds.includes(t.id));
}

export function removeArchivedTasks(tasks: Task[]): Task[] {
  return tasks.filter(t => !t.archived);
}

export function upsertTask(tasks: Task[], task: Task): Task[] {
  const index = tasks.findIndex(t => t.id === task.id);
  if (index >= 0) {
    const newTasks = [...tasks];
    newTasks[index] = task;
    return newTasks;
  }

  const firstTask = [...tasks].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))[0];
  const newTask = {
    ...task,
    rank: getNextRank(null, firstTask?.rank ?? null)
  };
  return [newTask, ...tasks];
}
