import { useState, useEffect, useRef, useMemo, useImperativeHandle, useCallback } from 'react';
import { Task, PlanConfig, Priority } from '@packages/types/shared';
import { PRIORITIES } from '@packages/core/config';
import { cn } from '@packages/ui/utils';
import { createNewTask } from '@packages/core/logic';
import { 
  Trash2, 
  Check, 
  ArchiveRestore, 
  Save, 
  ChevronDown,
  AlertCircle 
} from 'lucide-react';
import { UI_MESSAGES } from '@packages/types/messages';
import { Button } from '@packages/ui/Button';
import { Modal } from '@packages/ui/Modal';
import { motion, AnimatePresence } from 'motion/react';
import { useConfirm } from '@packages/storage/PlanContext';
import { useHotkey } from '../../../lib/useHotkey';
import { usePlan } from '@packages/storage/PlanContext';

export interface TaskDialogActions {
  isDirty: () => boolean;
}

interface TaskDialogProps {
  isOpen: boolean;
  task: Task | null;
  config: PlanConfig;
  initialStatus?: string;
  initialPriority?: string;
  initialTitle?: string;
  onClose: (force?: boolean) => void;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
  ref?: React.Ref<TaskDialogActions>;
}

export function TaskDialog({ isOpen, task, config, initialStatus, initialPriority, initialTitle, onClose, onSave, onDelete, ref }: TaskDialogProps) {
  const { confirm: confirmRequest } = useConfirm();
  const { setCurrentModule } = usePlan(); // for the Plan Settings link
  const [formData, setFormData] = useState<Partial<Task>>(() => {
    if (task) {
      return {
        ...task,
        dueDate: task.dueDate || '',
        tags: task.tags || [],
        content: task.content || [],
      };
    }
    const nt = createNewTask(initialTitle || '', config, []);
    return {
      ...nt,
      status: initialStatus || nt.status,
      priority: (initialPriority as Priority) || nt.priority,
    };
  });

  const [tagInput, setTagInput] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const initialData = useMemo(() => ({
    title: task?.title || initialTitle || '',
    status: task?.status || initialStatus || config.customFields.find(f => f.id === 'status')?.options?.[0]?.id || '',
    priority: task?.priority || (initialPriority as Priority) || 'Unassigned',
    dueDate: task?.dueDate || '',
    tags: task?.tags || [],
    content: task?.content || '',
    archived: task?.archived || false,
  }), [task, initialStatus, initialPriority, initialTitle, config.customFields]);

  const isDirty = useMemo(() => {
    if (!isOpen) return false;
    
    return (
      formData.title !== initialData.title ||
      formData.status !== initialData.status ||
      formData.priority !== initialData.priority ||
      formData.dueDate !== initialData.dueDate ||
      formData.content !== initialData.content ||
      formData.archived !== initialData.archived ||
      tagInput !== (task?.tags.join(', ') || '')
    );
  }, [formData, tagInput, initialData, task, isOpen]);

  useImperativeHandle(ref, () => ({
    isDirty: () => isDirty
  }), [isDirty]);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          ...task,
          dueDate: task.dueDate || '',
          tags: task.tags || [],
          content: task.content || '',
        });
      } else {
        const nt = createNewTask(initialTitle || '', config, []);
        setFormData({
          ...nt,
          status: initialStatus || nt.status,
          priority: (initialPriority as Priority) || nt.priority,
        });
      }
      setTagInput(task?.tags.join(', ') || '');
    }
  }, [isOpen, task, initialStatus, initialPriority, initialTitle, config]);

  const handleSave = useCallback(() => {
    if (!formData.title?.trim()) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    onSave({
      ...formData as Task,
      tags: tagInput.split(',').map(t => t.trim()).filter(t => t !== ''),
    });
    onClose(true); // Bypass dirty check on successful save
  }, [formData, tagInput, onSave, onClose]);

  // Handle Ctrl+S shortcut
  useHotkey('s', handleSave, { ctrlKey: true, metaKey: true, enabled: isOpen });

  const footer = (
    <div className="flex justify-between items-center gap-4 w-full">
      <div className="flex gap-2">
        {task && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const nextArchived = !formData.archived;
                setFormData({ ...formData, archived: nextArchived });
                onSave({
                  ...formData as Task,
                  archived: nextArchived,
                  tags: tagInput.split(',').map(t => t.trim()).filter(t => t !== ''),
                });
                onClose(true); // Bypass dirty check
              }}
              title={formData.archived ? "Restore from Archive" : "Complete Task"}
            >
              {formData.archived ? <ArchiveRestore className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              {formData.archived ? 'Restore' : 'Complete'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                const confirmed = await confirmRequest({
                  ...UI_MESSAGES.CONFIRMATIONS.DELETE_TASK,
                  message: UI_MESSAGES.CONFIRMATIONS.DELETE_TASK.message(task.title)
                });
                if (confirmed) {
                  onDelete(task.id);
                  onClose(true); // Bypass dirty check
                }
              }}
              className="text-priority-high hover:bg-priority-high/10 hover:text-priority-high"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4" />
          {task ? 'Save' : 'Add Task'}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Task Details' : 'New Task'}
      description={task ? `` : ''}
      footer={footer}
      className="w-[430px]"
    >
      <div className="text-text-primary flex flex-col" ref={topRef}>
        <div className="bg-sidebar -mx-6 -mt-6 p-6 space-y-5">
          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 px-4 py-2 bg-priority-high/10 border border-priority-high/20 rounded-md text-priority-high text-[13px]"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Title is mandatory.
              </motion.div>
            )}
          </AnimatePresence>

          <FormField label="Title" layout="horizontal">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full flex-1 bg-card border border-text-secondary rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder:text-text-secondary/50"
              placeholder="What needs to be done?"
              autoFocus
            />
          </FormField>

          <FormField label="Status" layout="horizontal">
            <div className="relative flex-1">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-card border border-text-secondary rounded-md px-3 py-1.5 pr-8 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none cursor-pointer"
              >
                {config.customFields.find(f => f.id === 'status')?.options?.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none opacity-60" />
            </div>
          </FormField>
        </div>

        <div className="pt-4">
          
          <p className="mb-4 text-center text-[13px] font-bold text-text-secondary italic">
            Optional...
          </p>
          
          <div className="space-y-5">

            <FormField label="Notes" layout="horizontal">
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={3}
                className="flex-1 bg-sidebar border border-border rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all resize-none font-sans placeholder:text-text-secondary/50"
                placeholder="Add some details..."
              />
            </FormField>

            <FormField label="Tags" layout="horizontal">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 bg-sidebar border border-border rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all placeholder:text-text-secondary/50"
                placeholder="e.g. feature, bug"
              />
            </FormField>

            <FormField label="Priority" layout="horizontal">
              <div className="relative flex-1">
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  className="w-full bg-sidebar border border-border rounded-md px-3 py-1.5 pr-8 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none cursor-pointer"
                >
                  {PRIORITIES.map(p => (
                    <option key={p} value={p}>{p || 'Unassigned'}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none opacity-60" />
              </div>
            </FormField>

            <FormField label="Due Date" layout="horizontal">
              <input
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value || '' })}
                className="flex-1 bg-sidebar border border-border rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
              />
            </FormField>

            {config.customFields && config.customFields.length > 0 && config.customFields.filter(field => field.id !== 'status').map(field => (
              <FormField key={field.id} label={field.label} layout="horizontal">
                {field.type === 'select' ? (
                  <div className="relative flex-1">
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      className="w-full bg-sidebar border border-border rounded-md px-3 py-1.5 pr-8 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select...</option>
                      {field.options?.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none opacity-60" />
                  </div>
                ) : field.type === 'date' ? (
                  <input
                    type="date"
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    className="flex-1 bg-sidebar border border-border rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    className="flex-1 bg-sidebar border border-border rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                    placeholder={`Enter value...`}
                  />
                )}
              </FormField>
            ))}
          </div>

          <div className="pt-6">
            <p className="text-[12px] text-text-secondary text-center font-medium">
              
              To customize fields, go to 
              <span
                onClick={() => {
                  setCurrentModule('settings');
                  onClose();
                }}
                className="pl-1 text-accent hover:underline cursor-pointer"
              >
                Plan Settings
              </span>.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function FormField({ label, children, layout = 'vertical' }: { label: string; children: React.ReactNode; layout?: 'vertical' | 'horizontal' }) {
  return (
    <div className={cn(
      "space-y-1.5 flex",
      layout === 'vertical' ? "flex-col" : "flex-row items-center gap-4"
    )}>
      <label className={cn(
        "text-[11px] font-semibold text-text-secondary uppercase select-none",
        layout === 'horizontal' && "w-24 shrink-0"
      )}>
        {label}
      </label>
      {children}
    </div>
  );
}
