import React, { useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Check } from 'lucide-react';
import { ANIMATION_TRANSITIONS } from '@packages/ui/constants';
import { Button } from '@packages/ui/Button';
import { Modal } from '@packages/ui/Modal';
import { TaskDialog, TaskDialogActions } from '../modules/tasks/TaskDialog';
import { UI_MESSAGES } from '@packages/types/messages';
import { TableSettingsDialog } from '../modules/tasks/TableSettingsDialog';
import { BoardSettingsDialog } from '../modules/tasks/BoardSettingsDialog';
import { cn } from '@packages/ui/utils';
import { usePlan } from '@packages/storage/PlanContext';

/**
 * --------------------------------------------------------------------------
 * Types
 * --------------------------------------------------------------------------
 */

export interface AppDialogsActions {
  isDirty: () => boolean;
}

interface AppDialogsProps {
  pendingNavigation: any | null;
  setPendingNavigation: (nav: any) => void;
  onCancelNavigation: () => void;
  onConfirmNavigation: (nav: any) => void;
  ref?: React.Ref<AppDialogsActions>;
}

/**
 * --------------------------------------------------------------------------
 * Component: AppDialogs
 * --------------------------------------------------------------------------
 * Centralized registry for all global overlays, modals, and toasts.
 * This keeps the main App structure focused on layout and logic routing.
 */
export function AppDialogs({
  pendingNavigation,
  setPendingNavigation,
  onCancelNavigation,
  onConfirmNavigation,
  ref
}: AppDialogsProps) {
  const { 
    modalState, 
    closeModal, 
    taskActions,
    config,
    metadata,
    tasks,
    toasts,
    saveSettings: onSaveConfig,
    confirmationRequest
  } = usePlan();
  
  const taskDialogRef = React.useRef<TaskDialogActions>(null);

/**
 * Imperative Handle
 * Provides methods to the parent component to check component state.
 */
  useImperativeHandle(ref, () => ({
    isDirty: () => {
      // Logic: Aggregate dirty state from sub-dialogs
      return taskDialogRef.current?.isDirty() || false;
    }
  }), []);

  /* -------------------------------------------------------------------------- */
  /* Handlers: Modal Interactivity                                              */
  /* -------------------------------------------------------------------------- */

  const handleTaskClose = (force?: boolean) => {
    if (!force && taskDialogRef.current?.isDirty()) {
      setPendingNavigation({ action: 'close-modal' });
    } else {
      closeModal();
    }
  };

  const handleConfirmDiscard = () => {
    onConfirmNavigation(pendingNavigation);
    closeModal();
  };

  return (
    <>
      {/* 1. Generic Confirmation Dialog */}
      <Modal
        isOpen={!!confirmationRequest}
        onClose={() => confirmationRequest?.resolve(false)}
        title={confirmationRequest?.title || 'Confirm Action'}
        className="max-w-sm"
      >
        {confirmationRequest && (
          <div className="text-center space-y-6">
            <div className={cn(
              "mx-auto w-12 h-12 rounded-full flex items-center justify-center",
              confirmationRequest.variant === 'danger' ? "bg-priority-high/10" : "bg-accent/10"
            )}>
              <AlertTriangle className={cn(
                "w-6 h-6",
                confirmationRequest.variant === 'danger' ? "text-priority-high" : "text-accent"
              )} />
            </div>
            <div className="space-y-2">
              <p className="text-[13px] text-text-secondary leading-relaxed">
                {confirmationRequest.message}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              {confirmationRequest.cancelLabel !== null && (
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => confirmationRequest.resolve(false)}
                >
                  {confirmationRequest.cancelLabel || 'Cancel'}
                </Button>
              )}
              <Button 
                variant={confirmationRequest.variant === 'danger' ? 'danger' : 'primary'}
                className={cn("flex-1", confirmationRequest.cancelLabel === null && "w-full")}
                onClick={() => confirmationRequest.resolve(true)}
              >
                {confirmationRequest.confirmLabel || 'Confirm'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 2. Navigation Guard (Unsaved Changes) */}
      <Modal
        isOpen={!!pendingNavigation}
        onClose={onCancelNavigation}
        title={UI_MESSAGES.NAVIGATION.DISCARD_CHANGES.title}
        className="max-w-sm"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-12 h-12 bg-priority-high/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-priority-high" />
          </div>
          <div className="space-y-2">
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {UI_MESSAGES.NAVIGATION.DISCARD_CHANGES.message}
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onCancelNavigation}
            >
              {UI_MESSAGES.NAVIGATION.DISCARD_CHANGES.cancelLabel}
            </Button>
            <Button 
              variant="danger" 
              className="flex-1"
              onClick={handleConfirmDiscard}
            >
              {UI_MESSAGES.NAVIGATION.DISCARD_CHANGES.confirmLabel}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 3. Success Feedback (Toasts) */}
      <AnimatePresence mode="popLayout">
        <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center gap-3 z-50">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={ANIMATION_TRANSITIONS.spring}
              className={cn(
                "px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-semibold text-[14px] transition-colors",
                toast.type === 'success' ? "bg-accent text-white" : "bg-bg-secondary text-text-primary border border-border"
              )}
            >
              <div className="flex-1 flex items-center gap-3">
                {toast.type === 'success' ? (
                  <Check className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-accent shrink-0" />
                )}
                <span>{toast.message}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* 4. Task Management (Modal) */}
      <TaskDialog
        ref={taskDialogRef}
        isOpen={modalState.type === 'editing' || modalState.type === 'creating'}
        task={modalState.type === 'editing' ? modalState.task : null}
        config={config}
        initialStatus={modalState.type === 'creating' ? modalState.initialStatus : undefined}
        initialPriority={modalState.type === 'creating' ? modalState.initialPriority : undefined}
        initialTitle={modalState.type === 'creating' ? modalState.initialTitle : undefined}
        onClose={handleTaskClose}
        onSave={taskActions.save}
        onDelete={(id) => taskActions.delete(id)}
      />

      {/* 5. Table Settings (Modal) */}
      <TableSettingsDialog
        isOpen={modalState.type === 'tableSettings'}
        onClose={closeModal}
        config={config}
        onSave={(newConfig) => {
          if (metadata) {
            onSaveConfig(newConfig, metadata, tasks);
          }
        }}
      />

      {/* 6. Board Settings (Modal) */}
      <BoardSettingsDialog
        isOpen={modalState.type === 'boardSettings'}
        onClose={closeModal}
        config={config}
        onSave={(newConfig) => {
          if (metadata) {
            onSaveConfig(newConfig, metadata, tasks);
          }
        }}
      />
    </>
  );
}
