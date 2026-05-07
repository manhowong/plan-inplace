import { PRIORITIES } from '@packages/core/config';
import { OPTION_COLORS } from '@packages/ui/constants';

export type TaskStatus = string;
export type Priority = typeof PRIORITIES[number];

// --------------------------------------------------------------------------
// Core Task Entities
// --------------------------------------------------------------------------

export interface RecentPlan {
  id: string;
  name: string;
  handle?: FileSystemDirectoryHandle;
  path?: string; // For VS Code or other path-based adapters
  lastOpened: number;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  rank: number;
  dueDate?: string;
  tags: string[];
  content: string;
  archived?: boolean;
  [key: string]: any; // For custom fields
}

// --------------------------------------------------------------------------
// Configuration & Schema Entities
// --------------------------------------------------------------------------

export interface DropdownOption {
  id: string;
  label: string;
  color: string;
}

export { OPTION_COLORS };
export type OptionColor = typeof OPTION_COLORS[number];

export interface CustomField {
  id: string;   // Used as the key in Task object and task file frontmatter
  label: string; // Used for UI display
  type: 'text' | 'select' | 'date';
  options?: DropdownOption[];
}

// --------------------------------------------------------------------------
// Metadata & Plan System Entities
// --------------------------------------------------------------------------

export interface PlanMetadata {
  id: string;
  name: string;
  notes: string;
  createdAt: string;
  appVersion: string;
}

export interface PlanConfig {
  customFields: CustomField[];
  tableView?: {
    columnOrder?: string[];
    columnVisibility?: Record<string, boolean>;
  };
  boardView?: {
    groupBy?: 'status' | 'priority';
  };
}

// --------------------------------------------------------------------------
// Action Interfaces
// --------------------------------------------------------------------------

export interface TaskActions {
  save: (task: Task) => Promise<void>;
  delete: (id: string) => Promise<void>;
  archive: (task: Task) => Promise<void>;
  restore: (task: Task) => Promise<void>;
  create: (status?: string, title?: string, priority?: string) => void;
  edit: (task: Task) => void;
  reorder: (taskId: string, field: string, value: string, overId: string | null, position: 'before' | 'after' | 'inside') => Promise<void>;
}

export interface ConfirmationRequest {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'warning';
  resolve: (value: boolean) => void;
}
