import { useState, memo, useMemo } from 'react';
import { Task, PlanConfig } from '@packages/types/shared';
import { TaskCard } from './TaskCard';
import { Button } from '@packages/ui/Button';
import { ScrollContainer } from '@packages/ui/ScrollContainer';
import { Plus } from 'lucide-react';
import { cn, COLOR_BG_MAP } from '@packages/ui/utils';
import { usePlan } from '@packages/storage/PlanContext';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  pointerWithin,
  useDndMonitor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// --------------------------------------------------------------------------
// Component: BoardView
// --------------------------------------------------------------------------

/**
 * Kanban-style board visualization. 
 * Groups tasks by status or priority into draggable columns.
 */
export function BoardView() {
  const { 
    tasks: allTasks, 
    config, 
    currentScope: scope, 
    taskActions, 
    openBoardSettings 
  } = usePlan();

  const boardGroupBy = config.boardView?.groupBy || 'status';
  const statusField = config?.customFields?.find(f => f.id === 'status');
  
  const columns = useMemo(() => {
    if (boardGroupBy === 'status') {
      return statusField?.options || [];
    } else {
      return [
        { id: 'High', label: 'High', color: 'red' },
        { id: 'Medium', label: 'Medium', color: 'yellow' },
        { id: 'Low', label: 'Low', color: 'emerald' },
        { id: 'Unassigned', label: 'Unassigned', color: 'slate' }
      ];
    }
  }, [boardGroupBy, statusField]);

  const tasks = useMemo(() => {
    return allTasks
      .filter(task => {
        if (!task) return false;
        return scope === 'archived' ? !!task.archived : !task.archived;
      })
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  }, [allTasks, scope]);

  const isArchived = scope === 'archived';

  // --- DND State ---
  const [activeTask, setActiveTask] = useState<Task | null>(null);

/* -------------------------------------------------------------------------- */
/* Handlers: Drag & Drop Logic                                              */
/* -------------------------------------------------------------------------- */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragOver = () => {
    // Handling drag over specifically for better visual feedback if needed.
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over, delta, activatorEvent } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    
    if (taskId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || activeData.type !== 'Task') return;

    if (overData?.type === 'Column') {
      const targetValue = overData.columnId;
      
      const overRect = over.rect;
      const pointerY = (activatorEvent as PointerEvent).clientY + delta.y;
      
      // If pointer is in top 60px of column (header area), drop to top
      if (pointerY - overRect.top < 60) {
        const columnTasks = tasks
          .filter((t) => t[boardGroupBy] === targetValue)
          .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
        
        if (columnTasks.length > 0) {
          taskActions.reorder(taskId, boardGroupBy, targetValue, columnTasks[0].id, 'before');
        } else {
          taskActions.reorder(taskId, boardGroupBy, targetValue, null, 'inside');
        }
      } else {
        taskActions.reorder(taskId, boardGroupBy, targetValue, null, 'inside');
      }
    } else if (overData?.type === 'Task') {
      const targetValue = overData.task[boardGroupBy];
      
      const overRect = over.rect;
      // Use pointer coordinates for logic (activator + current delta)
      const pointerY = (activatorEvent as PointerEvent).clientY + delta.y;
      const overCenterY = overRect.top + overRect.height / 2;
      
      const position = pointerY < overCenterY ? 'before' : 'after';
      taskActions.reorder(taskId, boardGroupBy, targetValue, overId, position);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <DndMonitorHelper />
      <ScrollContainer className="flex gap-4 p-6 bg-bg h-full">
        {columns.map((column) => {
          return (
            <BoardColumn 
              key={column.id}
              column={column}
              tasks={tasks}
              groupBy={boardGroupBy}
              config={config}
              isArchived={isArchived}
              taskActions={taskActions}
              openBoardSettings={openBoardSettings}
            />
          );
        })}
      </ScrollContainer>
      
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="pointer-events-none opacity-80">
             <TaskCard 
                task={activeTask} 
                config={config}
                boardGroupBy={boardGroupBy}
                onClick={() => {}} 
             />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// --------------------------------------------------------------------------
// Helper: DndMonitorHelper
// --------------------------------------------------------------------------

/**
 * Monitors active drag events to update visual indicators via DOM.
 * 
 * PERFORMANCE NOTE:
 * Instead of keeping drop-position in React state (which causes large-tree 
 * re-renders on every mouse move), we use a monitor and direct DOM 
 * manipulation for the indicators. This keeps the experience "snappy" even 
 * on lower-end devices by bypassing the React reconciliation loop.
 */
function DndMonitorHelper() {
  useDndMonitor({
    onDragMove(event) {
      const { active, over, delta, activatorEvent } = event;
      
      // Cleanup function to clear all indicators
      const clearIndicators = () => {
        document.querySelectorAll('[data-drop-position], [data-column-drop]').forEach(el => {
          el.removeAttribute('data-drop-position');
          el.removeAttribute('data-column-drop');
        });
      };

      if (!active || !over) {
        clearIndicators();
        return;
      }

      const overData = over.data.current;
      
      // CASE 1: Dragging over another Task
      if (overData?.type === 'Task' && active.id !== over.id) {
        const overRect = over.rect;
        // Use pointer coordinates for indicator logic
        const pointerY = (activatorEvent as PointerEvent).clientY + delta.y;
        const overCenterY = overRect.top + overRect.height / 2;
        const position = pointerY < overCenterY ? 'top' : 'bottom';
        
        const element = document.getElementById(`task-card-${over.id}`);
        if (element) {
          clearIndicators();
          element.setAttribute('data-drop-position', position);
        }
      } 
      // CASE 2: Dragging over an empty column or current column base
      else if (overData?.type === 'Column') {
        const element = document.getElementById(over.id as string);
        if (element) {
          clearIndicators();
          const overRect = over.rect;
          const pointerY = (activatorEvent as PointerEvent).clientY + delta.y;
          const position = pointerY - overRect.top < 60 ? 'top' : 'bottom';
          element.setAttribute('data-column-drop', position);
        }
      } 
      else {
        clearIndicators();
      }
    },
    onDragEnd() {
      // Final indicator cleanup
      document.querySelectorAll('[data-drop-position], [data-column-drop]').forEach(el => {
        el.removeAttribute('data-drop-position');
        el.removeAttribute('data-column-drop');
      });
    },
    onDragCancel() {
      document.querySelectorAll('[data-drop-position], [data-column-drop]').forEach(el => {
        el.removeAttribute('data-drop-position');
        el.removeAttribute('data-column-drop');
      });
    }
  });

  return null;
}

// --------------------------------------------------------------------------
// Helper: BoardColumn
// --------------------------------------------------------------------------

import { useDroppable } from '@dnd-kit/core';

interface BoardColumnProps {
  column: { id: string; label: string; color: string };
  tasks: Task[];
  groupBy: 'status' | 'priority';
  config: PlanConfig;
  isArchived: boolean;
  taskActions: any;
  openBoardSettings: () => void;
}

const BoardColumn = memo(({ 
  column, 
  tasks, 
  groupBy, 
  config, 
  isArchived, 
  taskActions, 
  openBoardSettings 
}: BoardColumnProps) => {
  const columnTasks = tasks
    .filter((t) => t[groupBy] === column.id)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: 'Column',
      columnId: column.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      id={`column-${column.id}`}
      className={cn(
        "flex-shrink-0 w-64 flex flex-col min-h-0 bg-sidebar rounded-md relative overflow-hidden h-full shadow-sm transition-colors duration-200 group/column",
        isOver && "bg-accent/15 ring-2 ring-accent/45"
      )}
    >
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 h-[3px]",
          groupBy === 'priority' ? `bg-priority-${column.id === 'Medium' ? 'med' : column.id.toLowerCase()}` : (COLOR_BG_MAP[column.color as keyof typeof COLOR_BG_MAP] || COLOR_BG_MAP.slate)
        )}
      />
      <div className="px-3 pt-3 flex items-center justify-between rounded-t-md">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:bg-border/30 px-2 py-1 -ml-2 rounded transition-colors"
          onClick={openBoardSettings}
        >
          <h3 className="font-semibold text-[13px] text-text-secondary flex items-center gap-2">
            {column.label}
            <span className="text-text-secondary font-normal px-2 py-0.5 rounded-full bg-border/60 text-[11px]">{columnTasks.length}</span>
          </h3>
        </div>
        {!isArchived && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => taskActions.create(
              groupBy === 'status' ? column.id : undefined,
              undefined,
              groupBy === 'priority' ? column.id : undefined
            )}
            className="hover:bg-accent/10 hover:text-accent"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div 
        className="flex-1 flex flex-col gap-2 overflow-y-auto px-1.5 pt-3 pb-4 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-text-secondary/20"
      >
        {/* Column-level indicator for top drop (header area) */}
        <div className="hidden group-data-[column-drop=top]/column:block mb-2 shrink-0">
          <div className="h-[4px] bg-accent rounded-full shadow-[0_0_12px_rgba(var(--accent),0.6)]" />
        </div>

        <SortableContext
          items={columnTasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              config={config}
              boardGroupBy={groupBy}
              onClick={() => taskActions.edit(task)} 
              onComplete={taskActions.archive}
              onDelete={(task) => taskActions.delete(task.id)}
              onRestore={taskActions.restore}
            />
          ))}
        </SortableContext>
        
        {/* Column-level indicator for bottom drop */}
        <div className="hidden group-data-[column-drop=bottom]/column:block mt-2 shrink-0">
          <div className="h-[4px] bg-accent rounded-full shadow-[0_0_12px_rgba(var(--accent),0.6)]" />
        </div>
        
        {columnTasks.length === 0 && !isArchived && (
          <button 
            onClick={() => taskActions.create(
              groupBy === 'status' ? column.id : undefined,
              undefined,
              groupBy === 'priority' ? column.id : undefined
            )}
            className="group py-6 border-2 border-dashed border-border/40 rounded-md flex flex-col items-center justify-center gap-2 opacity-30 hover:opacity-100 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Add Task</p>
          </button>
        )}

        {columnTasks.length === 0 && isArchived && (
          <div className="py-6 text-center">
            <p className="text-text-secondary text-[13px]">No tasks found.</p>
          </div>
        )}
      </div>
    </div>
  );
});

