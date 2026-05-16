import { useEffect, useState, useCallback } from 'react';
import { useViewState } from './useViewState';
import { useRecentPlans } from './useRecentPlans';
import { useFileIO } from './useFileIO';
import { usePlanState } from './usePlanState';
import { RecentPlan } from '@packages/types/shared';
import { ROOT_FOLDER_NAME } from '@packages/core/config';
import { UI_MESSAGES } from '@packages/types/messages';
import { isWorkspaceStorage, isNotifyStorage } from './adapters/base';

export type ToastType = 'info' | 'success';

export interface AppToast {
  id: string;
  message: string;
  type: ToastType;
  dismissible: boolean;
}

export type StorageState = ReturnType<typeof useStorage>;

/**
 * --------------------------------------------------------------------------
 * useStorage
 * --------------------------------------------------------------------------
 */
export function useStorage(confirmRequest?: (options: any) => Promise<boolean>) {
  // --- State Orchestration ---
  // The storage hook aggregates multiple internal state machines into a single interface.

  // 1. Manage UI/View State (Theme, Navigation, View preferences)
  const viewState = useViewState();

  // 2. Manage Device/Handle IO (Direct FS Access adapters and permission lifecycle)
  const fileIO = useFileIO();

  // 3. Manage Recently Viewed (Persistence of folder handles for session recovery)
  const recentPlans = useRecentPlans();

  // 4. Manage active Plan data (The core task engine and debounced JSON persistence)
  const planState = usePlanState(fileIO.storage, recentPlans.loadRecentPlans);

  // --- Toasts ---
  const [toasts, setToasts] = useState<AppToast[]>([]);
  
  const triggerToast = useCallback((message: string, type: ToastType = 'info', dismissible = false, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, dismissible }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Clear toasts on view change
  useEffect(() => {
    setToasts([]);
  }, [viewState.currentModule, viewState.currentScope, viewState.currentView]);

  // Fallback if no confirm provided (sanity check)
  const _confirm = confirmRequest || (async (o: any) => confirm(o.message));

  // Platform Notification Bridge
  useEffect(() => {
    if (isNotifyStorage(fileIO.storage)) {
      fileIO.storage.setNotifyHandler((message, level) => {
        triggerToast(message, level === 'error' ? 'info' : 'success');
      });
    }
  }, [fileIO.storage, triggerToast]);

/* -------------------------------------------------------------------------- */
/* Composition: Glue Logic & Orchestration                                   */
/* -------------------------------------------------------------------------- */

  /**
   * Complex Navigation: Open a bookmarked plan
   * Handles permission checks, existence verification, and state reset.
   */
  const openBookmark = async (plan: RecentPlan) => {
    if (!fileIO.storage) return;
    
    const success = await fileIO.storage.openBookmark(plan);
    if (success) {
      await planState.refresh();
    } else {
      const confirmed = await _confirm({
        ...UI_MESSAGES.CONFIRMATIONS.ACCESS_DENIED,
        message: UI_MESSAGES.CONFIRMATIONS.ACCESS_DENIED.message(plan.name)
      });
      if (confirmed) {
        await removeBookmark(plan.id);
      }
    }
  };

  const removeBookmark = async (id: string) => {
    await recentPlans.removeBookmark(id);
    if (planState.metadata?.id === id) {
      viewState.setCurrentModule('start');
      planState.clearPlan();
    }
  };

/* -------------------------------------------------------------------------- */
/* Action: Plan Lifecycle & Creation                                         */
/* -------------------------------------------------------------------------- */

  /**
   * Action: Remove current plan from index
   */
  const unlistCurrentPlan = async () => {
    if (!planState.metadata) return;
    await removeBookmark(planState.metadata.id);
  };

  /**
   * Action: Create new plan walkthrough
   */
  const createPlan = async () => {
    if (!fileIO.storage) return;

    try {
      const success = await fileIO.storage.requestPermission();
      if (success) {
        const exists = await fileIO.storage.hasEntry(ROOT_FOLDER_NAME);
        if (exists) {
          const confirmed = await _confirm(UI_MESSAGES.CONFIRMATIONS.PLAN_COLLISION);
          if (confirmed) {
            await planState.refresh();
          } else {
            planState.setIsReady(false);
          }
        } else {
          await planState.initializeNewPlan();
          const dirName = fileIO.storage.getDirectoryName();
          fileIO.storage.notify(fileIO.storage.type === 'browser' 
            ? UI_MESSAGES.APP_TOASTS.PLAN_CREATED(dirName) 
            : UI_MESSAGES.VSCODE_NOTIFICATIONS.PLAN_CREATED(dirName), 'info');
        }
      }
    } catch (e) {
      console.error('Failed to create plan', e);
    }
  };

  /**
   * Action: Open existing directory
   */
  const openPlan = async () => {
    if (!fileIO.storage) return;

    try {
      const path = await fileIO.storage.selectFolder();
      if (path) {
        const progressId = `scan-location-${Date.now()}`;
        if (isWorkspaceStorage(fileIO.storage)) {
          fileIO.storage.startProgress(progressId, UI_MESSAGES.VSCODE_NOTIFICATIONS.SCANNING_LOCATION);
        }
        try {
          const success = await planState.refresh();
          if (success) {
            fileIO.storage.notify(UI_MESSAGES.VSCODE_NOTIFICATIONS.LOAD_SUCCESS, 'info');
          } else {
            if (fileIO.storage.type === 'vscode') {
              fileIO.storage.notify(UI_MESSAGES.VSCODE_NOTIFICATIONS.NOT_DETECTED_LOCATION, 'warning');
            } else {
              await _confirm({
                message: UI_MESSAGES.ERRORS.IMPORT_FAILED_INVALID_DIR,
                title: 'Import Failed',
                confirmLabel: 'Understood',
                cancelLabel: undefined
              } as any);
            }
          }
        } finally {
          if (isWorkspaceStorage(fileIO.storage)) {
            fileIO.storage.stopProgress(progressId);
          }
        }
      }
    } catch (e) {
      console.error('Failed to open plan', e);
    }
  };

  // Bootstrap logic for VS Code auto-load with toasts
  const [hasTriedBootstrap, setHasTriedBootstrap] = useState(false);

  useEffect(() => {
    const s = fileIO.storage;
    if (isWorkspaceStorage(s) && !planState.isReady && !hasTriedBootstrap) {
      const bootstrap = async () => {
        setHasTriedBootstrap(true);
        const progressId = `scan-workspace-${Date.now()}`;
        s.startProgress(progressId, UI_MESSAGES.VSCODE_NOTIFICATIONS.SCANNING_WORKSPACE);

        const status = await s.scanWorkspaceStatus();
        s.stopProgress(progressId);

        if (status === 'loaded') {
          await planState.refresh();
          s.notify(UI_MESSAGES.VSCODE_NOTIFICATIONS.LOAD_SUCCESS, 'info');
        } 
      };
      bootstrap();
    }
  }, [fileIO.storage, planState.isReady, planState.refresh, hasTriedBootstrap, viewState.currentModule]);

  // Bootstrap bookmarks on mount
  useEffect(() => {
    recentPlans.loadRecentPlans().then(plans => {
      if (isWorkspaceStorage(fileIO.storage)) {
        fileIO.storage.syncRecentPlans(plans);
      }
    });
  }, [recentPlans.loadRecentPlans, fileIO.storage]);

  // Sync recent plans with VS Code whenever they change
  useEffect(() => {
    if (isWorkspaceStorage(fileIO.storage) && recentPlans.bookmarks.length > 0) {
      fileIO.storage.syncRecentPlans(recentPlans.bookmarks);
    }
  }, [recentPlans.bookmarks, fileIO.storage]);

/* -------------------------------------------------------------------------- */
/* API Export: Aggregate Results                                            */
/* -------------------------------------------------------------------------- */

  // Aggregate and return the public API
  return {
    // Hardware/Adapter
    storage: fileIO.storage,
    isSupported: fileIO.isSupported,
    requestPermission: fileIO.requestPermission,
    directoryName: fileIO.directoryName,
    directoryPath: fileIO.directoryPath,

    // Plan Content
    tasks: planState.tasks,
    config: planState.config,
    metadata: planState.metadata,
    isReady: planState.isReady,
    isPersisting: planState.isPersisting,
    needsPersist: planState.needsPersist,
    setIsReady: planState.setIsReady,
    
    // View State
    globalTheme: viewState.globalTheme,
    setGlobalTheme: viewState.setGlobalTheme,
    currentModule: viewState.currentModule,
    setCurrentModule: viewState.setCurrentModule,
    currentScope: viewState.currentScope,
    setCurrentScope: viewState.setCurrentScope,
    currentView: viewState.currentView,
    setCurrentView: viewState.setCurrentView,
    isSidebarCollapsed: viewState.isSidebarCollapsed,
    setIsSidebarCollapsed: viewState.setIsSidebarCollapsed,

    // Bookmarks
    bookmarks: recentPlans.bookmarks,
    lastPlan: recentPlans.lastPlan,
    removeBookmark,
    unlistCurrentPlan,
    openBookmark,
    
    // Commands
    refresh: planState.refresh,
    clearPlan: planState.clearPlan,
    saveTask: planState.saveTask,
    reorderTask: planState.reorderTask,
    deleteTask: planState.deleteTask,
    deleteTasks: planState.deleteTasks,
    saveSettings: planState.saveSettings,
    renameCustomField: planState.renameCustomField,
    createPlan,
    openPlan,
    triggerToast,
    dismissToast,
    toasts,
    
    // Legacy mapping (if any)
    saveConfig: planState.saveConfig, // Alias used in older versions
  };
}
