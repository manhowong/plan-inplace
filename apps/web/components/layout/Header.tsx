import React from 'react';
import { Plus, CornerDownLeft, Save, Trash2, EllipsisVertical, RotateCcw, Settings2, RefreshCw } from 'lucide-react';
import { Button } from '@packages/ui/Button';
import { createNewTask } from '@packages/core/logic';
import { usePlan, useConfirm } from '@packages/storage/PlanContext';
import { cn } from '@packages/ui/utils';
import { UI_MESSAGES } from '@packages/types/messages';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface HeaderProps {
  onSaveConfig?: () => void;
  onDiscardConfig?: () => void;
}

// --------------------------------------------------------------------------
// Component: Header
// --------------------------------------------------------------------------

export function Header({ 
  onSaveConfig,
  onDiscardConfig,
}: HeaderProps) {
  const { 
    currentModule, 
    currentScope, 
    currentView,
    config, 
    tasks,
    deleteTasks,
    taskActions, 
    openTableSettings, 
    openBoardSettings,
    needsPersist,
    isPersisting
  } = usePlan();
  
  const { confirm } = useConfirm();
  
  const [taskTitle, setTaskTitle] = React.useState('');
  const statusField = config?.customFields?.find(f => f.id === 'status');
  const [status, setStatus] = React.useState('');

  React.useEffect(() => {
    const defaultStatus = statusField?.options?.[0]?.id || '';
    setStatus(defaultStatus);
  }, [statusField]);

  const handleDeleteAllArchived = async () => {
    const archivedIds = tasks.filter(t => t.archived).map(t => t.id);
    if (archivedIds.length === 0) return;
    
    const confirmed = await confirm({
      ...UI_MESSAGES.CONFIRMATIONS.DELETE_ARCHIVE,
      message: UI_MESSAGES.CONFIRMATIONS.DELETE_ARCHIVE.message(archivedIds.length),
      variant: 'danger'
    });

    if (confirmed) {
      await deleteTasks(archivedIds);
    }
  };

/* -------------------------------------------------------------------------- */
/* Handlers: Interaction                                                     */
/* -------------------------------------------------------------------------- */

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    
    const newTask = createNewTask(taskTitle, config, []);
    taskActions.save(newTask);
    setTaskTitle('');
  };

  if (currentModule === 'help' || currentModule === 'start' || currentModule === 'about') {
    return null;
  }

  return (
    <nav className="h-16 border-b border-border flex items-center justify-between px-6 bg-bg sticky top-0 z-30 shrink-0">
      {currentModule === 'tasks' && currentScope === 'active' && (
        <>
            <div className="flex items-center gap-4 flex-1">
              <form onSubmit={handleQuickAdd} className="hidden min-[600px]:flex items-center gap-3">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    autoFocus
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Quick add a task..."
                    className="flex-1 min-w-16 max-w-64 h-9 bg-sidebar border border-border rounded-md pr-9 pl-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all placeholder:text-text-secondary/50"
                  />
                  <CornerDownLeft className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary group-focus-within:text-accent transition-colors pointer-events-none" />
                </div>

                <Button 
                  type="submit" 
                  disabled={!taskTitle.trim()}
                  className="h-9 px-3 text-[13px]"
                >
                  Add
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => taskActions.create(status, taskTitle)}
                  className="h-9 px-3 text-[13px] whitespace-nowrap"
                  title="Open in Details"
                >
                  <EllipsisVertical className='w-3.5 h-3.5'/>
                  Details
                </Button>
              </form>

              {/* Persistence Status */}
              <div className="hidden min-[800px]:flex items-center gap-2 text-[11px] text-text-secondary ml-2 min-w-[80px]">
                {(needsPersist || isPersisting) && (
                  <div className="flex items-center gap-1.5 text-accent/80">
                    <RefreshCw className={cn("w-3 h-3", isPersisting && "animate-spin")} />
                    <span className="font-medium">{isPersisting ? 'Saving...' : 'Syncing...'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="min-[600px]:hidden flex-1 overflow-hidden">
              <Button 
                onClick={() => taskActions.create(status, '')}
                className="w-full bg-accent hover:bg-accent/90 text-white h-9 px-3 text-[13px] whitespace-nowrap overflow-hidden"
              >
                <Plus className="w-4 h-4 mr-1 shrink-0" />
                Add Task
              </Button>
            </div>
          
          <div>
            {currentView === 'list' && (
              <Button
                variant="outline"
                onClick={openTableSettings}
                className="h-9 px-3 text-[13px] whitespace-nowrap ml-3"
                title="Table Settings"
              >
                <Settings2 className="w-4 h-4 mr-2"/>
                Table Settings
              </Button>
            )}
            {currentView === 'board' && (
              <Button
                variant="outline"
                onClick={openBoardSettings}
                className="h-9 px-3 text-[13px] whitespace-nowrap ml-3"
                title="Board Settings"
              >
                <Settings2 className="w-4 h-4 mr-2"/>
                Board Settings
              </Button>
            )}
          </div>
        </>
      )}

      {currentModule === 'tasks' && currentScope === 'archived' && (
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-xl font-bold text-text-primary">Archived Tasks</h2>
          <Button
            variant="ghost"
            onClick={handleDeleteAllArchived}
            className="text-priority-high hover:text-priority-high hover:bg-priority-high/10 h-9"
          >
            <Trash2 className="w-4 h-4" />
            Delete All
          </Button>
        </div>
      )}

      {currentModule === 'settings' && (
        <div className="flex items-center justify-between w-full max-w-xl">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Plan Settings</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onDiscardConfig}
              className="px-3 h-9"
            > 
              <RotateCcw className="w-4 h-4" />
              Discard Changes
            </Button>
            <Button
              onClick={onSaveConfig}
              className="px-3 h-9"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
