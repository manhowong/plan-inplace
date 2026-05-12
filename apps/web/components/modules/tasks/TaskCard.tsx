import { memo } from 'react';
import { Task, PlanConfig } from '@packages/types/shared';
import { cn } from '@packages/ui/utils';
import { formatTaskDate } from '@packages/core/logic';
import { motion } from 'motion/react';
import { Check, Trash2, ArchiveRestore, NotepadText } from 'lucide-react';
import { UI_MESSAGES } from '@packages/types/messages';
import { Badge } from '@packages/ui/Badge';
import { Tooltip } from '@packages/ui/Tooltip';
import { useConfirm } from '@packages/storage/PlanContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Linkify from "linkify-react";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onComplete?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onRestore?: (task: Task) => void;
  boardGroupBy?: 'status' | 'priority';
  config?: PlanConfig;
}

/**
 * --------------------------------------------------------------------------
 * Component: TaskCard
 * --------------------------------------------------------------------------
 * Individual task item visualization. Supports drag-and-drop start
 * events and provides quick-action buttons for task management.
 */
export const TaskCard = memo(({ 
  task, 
  onClick, 
  onComplete, 
  onDelete, 
  onRestore,
  boardGroupBy = 'status',
  config
}: TaskCardProps) => {
  const { confirm: confirmRequest } = useConfirm();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task
    }
  });

  const style = {
    transition: 'none',
    transform: isDragging ? CSS.Translate.toString(transform) : undefined,
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef}
        className="opacity-0 rounded-md border-2 border-dashed border-border/40"
        style={{ ...style, minHeight: '120px', width: '100%' }}
      />
    );
  }
  
  // Linkify options (Auto-detect linkable text)
  const linkifyOptions = {target: "_blank", rel: "noopener noreferrer", className: "underline"};

  return (
    <motion.div
      ref={setNodeRef}
      id={`task-card-${task.id}`}
      style={style}
      layoutId={task.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative"
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      {/* 
        PERFORMANCE OPTIMIZATION: 
        We use data-attributes and CSS for indicators rather than React state. 
        High-frequency dragging (60fps) causes too many re-renders in React 
        if we track pointer position in state. Direct DOM manipulation for 
        visual-only overrides is significantly smoother.
      */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <div className="hidden group-data-[drop-position=top]:block absolute -top-[12px] left-0 right-0 h-[4px] bg-accent rounded-full shadow-[0_0_12px_rgba(var(--accent),0.6)]" />
        <div className="hidden group-data-[drop-position=bottom]:block absolute -bottom-[12px] left-0 right-0 h-[4px] bg-accent rounded-full shadow-[0_0_12px_rgba(var(--accent),0.6)]" />
      </div>

      <div
        className="bg-card p-3 rounded-md border border-border hover:border-text-secondary/50 cursor-grab active:cursor-grabbing transition-all duration-150 shadow-sm relative"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-[14px] leading-snug text-text-primary group-hover:text-accent transition-colors line-clamp-3 cursor-pointer">
            <Linkify options={linkifyOptions}>
              {task.title}
            </Linkify>
          </h4>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {onComplete && !task.archived && (
              <Tooltip content="Complete task" position="left">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete(task);
                  }}
                  className="p-1 rounded hover:bg-priority-low/10 text-text-secondary hover:text-priority-low transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            )}
            {onRestore && task.archived && (
              <Tooltip content="Restore task" position="left">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore(task);
                  }}
                  className="p-1 rounded hover:bg-accent/10 text-text-secondary hover:text-accent transition-colors"
                >
                  <ArchiveRestore className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip content="Delete permanently" position="left">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const confirmed = await confirmRequest({
                      ...UI_MESSAGES.CONFIRMATIONS.DELETE_TASK,
                      message: UI_MESSAGES.CONFIRMATIONS.DELETE_TASK.message(task.title),
                      variant: 'danger'
                    });
                    if (confirmed) {
                      onDelete(task);
                    }
                  }}
                  className="p-1 rounded hover:bg-priority-high/10 text-text-secondary hover:text-priority-high transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {task.content && (
              <div className='relative group/notes'>
                <NotepadText className="w-3.5 text-text-secondary"/>
                <div className='z-100 absolute hidden m-0.5 shadow-lg px-2 py-1 w-max max-w-58 whitespace-pre-line rounded-md  bg-text-primary text-bg border border-border group-hover/notes:block'>
                  <p className='font-semibold'>Notes:</p>
                  <Linkify options={linkifyOptions}>
                    {task.content}
                  </Linkify>
                </div>
              </div>
          )}
          
          {task.tags.map(tag => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-text-secondary pt-2 mt-auto text-right">
          <div className="flex items-center gap-2 opacity-80 w-full">
            <div className="flex items-center gap-1.5 w-full">
              {task.dueDate && (() => {
                const { text, colorClass } = formatTaskDate(task.dueDate, task.archived);
                return (
                  <span className={cn("text-text-primary font-medium", colorClass)}>
                    {text != "Overdue" ? `Due ${text}` : text}
                  </span>
                );
              })()}
            </div>
            {/* Show badge for the property NOT being used for grouping */}
            {boardGroupBy === 'status' && task.priority && task.priority !== "Unassigned" && (
              <div className="ml-auto flex items-center gap-1.5 font-medium">
                <div className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  task.priority === 'High' ? "bg-priority-high" :
                  task.priority === 'Medium' ? "bg-priority-med" :
                  task.priority === 'Low' ? "bg-priority-low" :
                  "bg-priority-unassigned"
                )} />
                <span className="text-[10px]">{task.priority}</span>
              </div>
            )}
            {boardGroupBy === 'priority' && task.status && (
              <div className="ml-auto flex items-center gap-1.5 font-medium">
                {(() => {
                  const statusField = config?.customFields?.find(f => f.id === 'status');
                  const option = statusField?.options?.find(o => o.id === task.status);
                  return (
                    <Badge variant="option" optionColor={option?.color} className="whitespace-nowrap !text-[10px]">
                      {option?.label || task.status}
                    </Badge>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

