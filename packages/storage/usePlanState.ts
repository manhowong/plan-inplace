import { useState, useCallback, useRef, useEffect } from 'react';
import { Task, PlanConfig, PlanMetadata } from '@packages/types/shared';
import {
  createInitialPlan,
  migrateTaskFields,
  parseMetadata,
  parseTasks,
  prepareMetadataPayload,
  removeTaskById,
  removeTasksByIds,
  reorderTasks,
  sanitizeTasks,
  upsertTask
} from '@packages/core/logic';
import { DEFAULT_PLAN_CONFIG, METADATA_FILE, PLAN_FILE } from '@packages/core/config';
import { StorageManager } from './adapters/base';

/**
 * --------------------------------------------------------------------------
 * usePlanState
 * --------------------------------------------------------------------------
 * The operational core of the application data layer. Manages the active
 * task list, project configuration, and metadata. Handles the lifecycle 
 * of project loading (refresh) and background persistence.
 */
export function usePlanState(storage: StorageManager | null, loadRecentPlans: () => Promise<any>) {
  // --- Core Data ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metadata, setMetadata] = useState<PlanMetadata | null>(null);
  const [rawMetadata, setRawMetadata] = useState<any>({});
  const [isReady, setIsReady] = useState(false);
  const [config, setConfig] = useState<PlanConfig>(DEFAULT_PLAN_CONFIG);

  // --- Persistence & Refresh State ---
  const isRefreshing = useRef(false);
  const refreshRequested = useRef(false);
  const [needsPersist, setNeedsPersist] = useState(false);
  const [isPersisting, setIsPersisting] = useState(false);
  const isPersistingRef = useRef(false);
  const persistTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mutex for storage operations to prevent race conditions without magic timeouts
  const storageLock = useRef<Promise<any>>(Promise.resolve());
  
  const runLocked = useCallback(async <T>(op: () => Promise<T>): Promise<T> => {
    const nextOp = storageLock.current.then(op);
    storageLock.current = nextOp.then(() => {}, () => {}); // Catch all to ensure queue doesn't stall
    return nextOp;
  }, []);

/* -------------------------------------------------------------------------- */
/* Logic: Refresh (Loading) & Initialization                                 */
/* -------------------------------------------------------------------------- */

  const initializeNewPlan = useCallback(async () => {
    if (!storage) return;

    try {
      await runLocked(async () => {
        const dirName = storage.getDirectoryName();
        const { plan: initialPlan, config: initialConfig } = createInitialPlan(dirName);
        const metadataPayload = prepareMetadataPayload({}, initialConfig, initialPlan);

        await storage.writeFile(METADATA_FILE, JSON.stringify(metadataPayload, null, 2));
        await storage.writeFile(PLAN_FILE, JSON.stringify({ tasks: [] }, null, 2));
        
        setConfig(initialConfig);
        setMetadata(initialPlan);
        setRawMetadata(metadataPayload);
        setTasks([]);
        setIsReady(true);

        await storage.registerPlan(initialPlan.id, initialPlan.name);
        await loadRecentPlans();
      });
    } catch (e) {
      console.error('Failed to initialize new plan', e);
    }
  }, [storage, loadRecentPlans, runLocked]);

  // --- Logic: Refresh (Loading) ---
  const refresh = useCallback(async (): Promise<boolean> => {
    if (!storage) return false;

    // Safety: If we have local changes that haven't been saved, or if we are currently 
    // in the middle of a write operation, we MUST NOT refresh. 
    // Refreshing now would read the "old" data from disk and overwrite the user's
    // latest changes in memory, causing the "reverting" behavior.
    if (needsPersist || isPersistingRef.current) {
      return true; 
    }
    
    const hasPerm = await storage.hasPermission();
    if (!hasPerm) {
      setIsReady(false);
      return false;
    }

    if (isRefreshing.current) {
      refreshRequested.current = true;
      return true;
    }
    
    isRefreshing.current = true;
    refreshRequested.current = false;
    
    try {
      return await runLocked(async () => {
        const metadataStr = await storage.readFile(METADATA_FILE);
        const planStr = await storage.readFile(PLAN_FILE);

        if (metadataStr && planStr) {
          try {
            const contents = parseMetadata(metadataStr, storage.getDirectoryName());
            const parsedTasks = parseTasks(planStr);
            const { tasks: loadedTasks, updated } = sanitizeTasks(parsedTasks);

            setConfig(contents.config);
            setMetadata(contents.plan);
            setRawMetadata(contents.raw);
            setTasks(loadedTasks);
            setIsReady(true);
            
            if (updated) {
              setNeedsPersist(true);
            }

            await storage.registerPlan(contents.id, contents.name);
            await loadRecentPlans();
            return true;
          } catch (e) {
            console.error('Error parsing Plan InPlace data', e);
            setIsReady(false);
            return false;
          }
        } else {
          setIsReady(false);
          return false;
        }
      });
    } catch (error) {
      console.error('Refresh error', error);
      setIsReady(false);
      return false;
    } finally {
      isRefreshing.current = false;
      if (refreshRequested.current) {
        refreshRequested.current = false;
        refresh();
      }
    }
  }, [storage, loadRecentPlans, runLocked, needsPersist]);

  // --- Logic: Persistence (Saving) ---
  const persist = useCallback(async (updatedConfig: PlanConfig, updatedTasks: Task[], updatedMetadata?: PlanMetadata) => {
    if (!storage) return;
    try {
      isPersistingRef.current = true;
      setIsPersisting(true);
      await runLocked(async () => {
        const metadataPayload = prepareMetadataPayload(rawMetadata, updatedConfig, updatedMetadata);
        
        if (updatedMetadata) {
          await storage.registerPlan(updatedMetadata.id, updatedMetadata.name);
          await loadRecentPlans();
          setRawMetadata(metadataPayload);
        }
        
        await storage.writeFile(METADATA_FILE, JSON.stringify(metadataPayload, null, 2));
        await storage.writeFile(PLAN_FILE, JSON.stringify({ tasks: updatedTasks }, null, 2));
      });
    } catch (e) {
      console.error('Persist error', e);
    } finally {
      isPersistingRef.current = false;
      setIsPersisting(false);
    }
  }, [storage, loadRecentPlans, rawMetadata, runLocked]);

  // --- Persistence Watcher ---
  // Debounces persistence requests to ensure multiple rapid changes
  // (like status updates in board view) only trigger a single write.
  useEffect(() => {
    if (needsPersist) {
      if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
      persistTimeoutRef.current = setTimeout(() => {
        setNeedsPersist(false);
        persist(config, tasks, metadata || undefined);
      }, 250);
    }
    return () => { if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current); };
  }, [needsPersist, config, tasks, metadata, persist]);

  // Handle FS updates
  useEffect(() => {
    if (storage) {
      storage.onUpdate(refresh);
      refresh();
    }
  }, [storage, refresh]);

/* -------------------------------------------------------------------------- */
/* Handlers: CRUD & State Updates                                           */
/* -------------------------------------------------------------------------- */

  const saveTask = async (task: Task) => {
    setTasks(prev => upsertTask(prev, task));
    setNeedsPersist(true);
  };

  const reorderTask = async (taskId: string, field: string, value: string, overId: string | null, position: 'before' | 'after' | 'inside') => {
    setTasks(prev => reorderTasks(prev, taskId, field, value, overId, position));
    setNeedsPersist(true);
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => removeTaskById(prev, id));
    setNeedsPersist(true);
  };

  const deleteTasks = async (ids: string[]) => {
    setTasks(prev => removeTasksByIds(prev, ids));
    setNeedsPersist(true);
  };

  const saveConfig = async (newConfig: PlanConfig) => {
    setConfig(newConfig);
    setNeedsPersist(true);
  };

  const saveSettings = async (newConfig: PlanConfig, newMetadata?: PlanMetadata, updatedTasks?: Task[]) => {
    setConfig(newConfig);
    if (newMetadata) {
      setMetadata(newMetadata);
      // We also update rawMetadata here to ensure a clean switch
      setRawMetadata((prev: any) => prepareMetadataPayload(prev, newConfig, newMetadata));
    }
    if (updatedTasks) setTasks(updatedTasks);
    setNeedsPersist(true);
  };

  const renameCustomField = async (oldId: string, newId: string) => {
    setTasks(prev => migrateTaskFields(prev, oldId, newId));
    setNeedsPersist(true);
  };

  const clearPlan = useCallback(() => {
    setMetadata(null);
    setRawMetadata({});
    setTasks([]);
    setIsReady(false);
  }, []);

  return {
    tasks,
    config,
    metadata,
    isReady,
    isPersisting,
    needsPersist,
    setIsReady,
    refresh,
    saveTask,
    deleteTask,
    deleteTasks,
    saveConfig,
    saveSettings,
    reorderTask,
    renameCustomField,
    initializeNewPlan,
    clearPlan
  };
}
