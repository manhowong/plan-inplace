import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { Task, TaskActions, ConfirmationRequest } from '@packages/types/shared';
import { useStorage, StorageState } from './useStorage';
import { UI_MESSAGES } from '@packages/types/messages';

/**
 * --------------------------------------------------------------------------
 * Types
 * --------------------------------------------------------------------------
 */

export type ModalState = 
  | { type: 'closed' }
  | { type: 'editing'; task: Task }
  | { type: 'creating'; initialStatus?: string; initialPriority?: string; initialTitle?: string }
  | { type: 'tableSettings' }
  | { type: 'boardSettings' };

interface PlanContextRef extends StorageState {
  // Modal Management
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  closeModal: () => void;
  openTableSettings: () => void;
  openBoardSettings: () => void;
  
  // Logical Shortcuts (for components)
  taskActions: TaskActions;
  confirm: (request: Omit<ConfirmationRequest, 'resolve'>) => Promise<boolean>;
  confirmationRequest: ConfirmationRequest | null;
}

const PlanContext = createContext<PlanContextRef | undefined>(undefined);

/**
 * --------------------------------------------------------------------------
 * usePlan
 * --------------------------------------------------------------------------
 * The primary hook for all state, actions, and modal management.
 */
export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}

/**
 * useConfirm
 * A simplified hook that pulls the confirm function from PlanContext.
 */
export function useConfirm() {
  const { confirm } = usePlan();
  return { confirm };
}

// Backward compatibility alias
export const useActionContext = usePlan;

/**
 * --------------------------------------------------------------------------
 * PlanProvider
 * --------------------------------------------------------------------------
 */
interface PlanProviderProps {
  children: ReactNode;
}

export function PlanProvider({ children }: PlanProviderProps) {
  // 1. Manage confirmation state directly
  const [confirmationRequest, setConfirmationRequest] = useState<ConfirmationRequest | null>(null);

  const confirm = useCallback((options: Omit<ConfirmationRequest, 'resolve'>): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmationRequest({
        ...options,
        resolve: (result: boolean) => {
          setConfirmationRequest(null);
          resolve(result);
        }
      });
    });
  }, []);

  // 2. Initialize storage with the confirm callback
  const storage = useStorage(confirm);

  // 3. Manage internal modal state
  const [modalState, setModalState] = useState<ModalState>({ type: 'closed' });
  const closeModal = () => setModalState({ type: 'closed' });

  // 3. Compose task actions
  const taskActions: TaskActions = useMemo(() => ({
    save: async (task: Task) => {
      await storage.saveTask(task);
      storage.triggerToast(UI_MESSAGES.APP_TOASTS.TASK_SAVED, 'success');
      closeModal();
    },
    delete: async (id: string) => {
      await storage.deleteTask(id);
      storage.triggerToast(UI_MESSAGES.APP_TOASTS.TASK_DELETED, 'success');
      closeModal();
    },
    archive: async (task: Task) => {
      await storage.saveTask({ ...task, archived: true });
      storage.triggerToast(UI_MESSAGES.APP_TOASTS.TASK_ARCHIVED, 'success');
    },
    restore: async (task: Task) => {
      await storage.saveTask({ ...task, archived: false });
      storage.triggerToast(UI_MESSAGES.APP_TOASTS.TASK_RESTORED, 'success');
    },
    create: (status?: string, title?: string, priority?: string) => setModalState({ type: 'creating', initialStatus: status, initialTitle: title, initialPriority: priority }),
    edit: (task: Task) => setModalState({ type: 'editing', task }),
    reorder: storage.reorderTask,
  }), [storage.saveTask, storage.deleteTask, storage.reorderTask]);

  const openTableSettings = () => setModalState({ type: 'tableSettings' });
  const openBoardSettings = () => setModalState({ type: 'boardSettings' });

  // 4. Build unified context value
  const value = useMemo(() => ({
    ...storage,
    modalState,
    setModalState,
    closeModal,
    openTableSettings,
    openBoardSettings,
    taskActions,
    confirm,
    confirmationRequest
  }), [storage, modalState, taskActions, confirm, confirmationRequest]);

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
}
