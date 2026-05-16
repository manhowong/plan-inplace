import { ROOT_FOLDER_NAME, METADATA_FILE } from '@packages/core/config';

/**
 * --------------------------------------------------------------------------
 * UI_MESSAGES
 * --------------------------------------------------------------------------
 * Centralized registry for all user-facing strings, toasts, and confirmations.
 * This ensures consistency across the React frontend and VS Code extension levels.
 */
export const UI_MESSAGES = {
  APP_TOASTS: {
    PLAN_CREATED: (dir: string) => `${ROOT_FOLDER_NAME} folder created in ${dir}`,
    SETTINGS_SAVED: 'Changes saved successfully!',
    TASK_SAVED: 'Task saved',
    TASK_ARCHIVED: 'Task completed and archived',
    TASK_RESTORED: 'Task restored to active list',
    TASK_DELETED: 'Task deleted'
  },

  VSCODE_NOTIFICATIONS: {
    PLAN_CREATED: (dir: string) => `${ROOT_FOLDER_NAME} folder created in ${dir}`,
    SCANNING_LOCATION: 'Scanning selected location for plan...',
    SCANNING_WORKSPACE: 'Scanning for plan in current workspace...',
    LOAD_SUCCESS: 'Plan loaded successfully',
    NOT_DETECTED_LOCATION: `${ROOT_FOLDER_NAME} data not detected in selected location`,
    NOT_DETECTED_WORKSPACE: `${ROOT_FOLDER_NAME} data not detected in current workspace`
  },
  
  CONFIRMATIONS: {
    DELETE_TASK: {
      title: 'Delete Task',
      message: (title: string) => `Are you sure you want to permanently delete "${title}"?`,
      confirmLabel: 'Delete'
    },
    DELETE_ARCHIVE: {
      title: 'Clear Archive',
      message: (count: number) => `Are you sure you want to permanently delete all ${count} archived tasks? This cannot be undone.`,
      confirmLabel: 'Delete All'
    },
    REMOVE_PLAN: {
      title: 'Remove Plan',
      message: (name?: string) => name 
        ? `Are you sure you want to remove "${name}" from your list? The files will remain on your disk.`
        : 'Are you sure you want to remove this plan from your list? The files will remain on your disk.',
      confirmLabel: 'Remove'
    },
    PLAN_COLLISION: {
      title: 'Plan Collision',
      message: `A ${ROOT_FOLDER_NAME} already exists in this location. Would you like to import it instead?`,
      confirmLabel: 'Import Existing'
    },
    PLAN_NOT_FOUND: {
      title: 'Plan Not Found',
      message: (name: string) => `The plan "${name}" could not be found. Would you like to remove it from your recent list?`,
      confirmLabel: 'Remove'
    },
    ACCESS_DENIED: {
      title: 'Access Denied',
      message: (name: string) => `The folder for "${name}" could not be accessed. Would you like to remove it?`,
      confirmLabel: 'Remove'
    }
  },

  ERRORS: {
    IMPORT_FAILED_INVALID_DIR: `The selected folder must be a "${ROOT_FOLDER_NAME}" folder or contain a "${ROOT_FOLDER_NAME}" subfolder with a valid ${METADATA_FILE}.`,
    PERMISSION_DENIED: 'Failed to open the plan. Make sure you have granted the correct permissions.',
    FIELD_LABEL_EMPTY: 'Field label cannot be empty.',
    FIELD_LABEL_DUPLICATE: 'Field labels must be unique.',
    FIELD_OPTIONS_MIN: (label: string) => `Field "${label}" must have at least one option.`,
    FIELD_OPTIONS_EMPTY: (label: string) => `Field "${label}" has empty options.`,
    
    // VS Code integration errors
    VSCODE_NO_WORKSPACE: 'No workspace open to create a plan.',
    VSCODE_CREATE_FAILED: 'Failed to create plan.',
    VSCODE_ADD_TASK_FAILED: 'Failed to add task.',
    VSCODE_UPDATE_STATUS_FAILED: 'Failed to update task status.',
    VSCODE_DELETE_TASK_FAILED: 'Failed to delete task.',
    VSCODE_CLEAR_ARCHIVE_FAILED: 'Failed to clear archived tasks.',
    VSCODE_WRITE_FILE_FAILED: (name: string) => `Failed to write file: ${name}`,
    VSCODE_DELETE_FILE_FAILED: (name: string) => `Failed to delete file: ${name}`,
    VSCODE_CLEAR_DATA_FAILED: 'Failed to clear plan data',
    
    // Settings errors
    PARSE_FAILED: 'Could not parse the selected file. Ensure it is a valid metadata.json file.',
    INVALID_CONFIG: 'The selected file does not contain a valid Plan InPlace configuration.',
    IMPORT_FAILED: 'Import failed. Make sure you selected a valid metadata.json file.'
  },

  NAVIGATION: {
    DISCARD_CHANGES: {
      title: 'Unsaved Changes',
      message: 'Do you want to discard unsaved changes?',
      confirmLabel: 'Discard',
      cancelLabel: 'Cancel'
    }
  },

  STATIC: {
    START: {
      CREATE_TITLE: 'Create a Plan',
      OPEN_TITLE: 'Open a Plan',
      RECENT_TITLE: 'Recently Viewed',
      RECENT_EMPTY: 'No recent plans found.'
    },
    HELP: {
      TITLE: 'Help',
      DESC: 'How Plan InPlace works and how to use it.'
    },
    VERSION: 'Version 1.0.0'
  }
} as const;
