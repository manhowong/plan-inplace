import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import { Button } from '@packages/ui/Button';
import { Modal } from '@packages/ui/Modal';
import { PlanConfig, CustomField } from '@packages/types/shared';
import { cn } from '@packages/ui/utils';

/**
 * --------------------------------------------------------------------------
 * Types
 * --------------------------------------------------------------------------
 */

export type MigrationStep = 
  | { type: 'field'; field: CustomField; taskCount: number }
  | { type: 'option'; field: CustomField; option: { id: string; label: string }; taskCount: number };

interface MigrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  queue: MigrationStep[];
  currentIndex: number;
  targetId: string;
  setTargetId: (id: string) => void;
  config: PlanConfig;
}

/**
 * --------------------------------------------------------------------------
 * Component: MigrationDialog
 * --------------------------------------------------------------------------
 */

export function MigrationDialog({
  isOpen,
  onClose,
  onConfirm,
  queue,
  currentIndex,
  targetId,
  setTargetId,
  config
}: MigrationDialogProps) {
  const currentStep = queue[currentIndex];
  if (!currentStep) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentStep.type === 'field' ? 'Field Deletion' : 'Option Migration'}
      className="max-w-md"
      footer={
        <div className="flex gap-3 w-full">
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={onClose}
          >
            Cancel Save
          </Button>
          <Button 
            className="flex-1 font-bold"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-priority-high/10 text-priority-high flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          
          <div className="space-y-2">
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {currentStep.type === 'field' 
                ? `Deleting the field "${currentStep.field.label}" will remove its data from ${currentStep.taskCount} task(s). This cannot be undone.`
                : `The option "${(currentStep as any).option.label}" in field "${currentStep.field.label}" is being removed. What should happen to the ${currentStep.taskCount} task(s) currently using it?`
              }
            </p>
          </div>
        </div>

        {currentStep.type === 'option' && (
          <div className="space-y-4">
            <div 
              className={cn(
                "p-4 rounded-md border-2 transition-all cursor-pointer flex items-center justify-between group",
                targetId === 'clear' ? "border-accent bg-accent/5" : "border-border hover:border-text-secondary/20"
              )}
              onClick={() => setTargetId('clear')}
            >
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-text-primary">Clear values</span>
                <span className="text-[11px] text-text-secondary">Affected tasks will have this field emptied</span>
              </div>
              {targetId === 'clear' && <Check className="w-4 h-4 text-accent" />}
            </div>

            <div 
              className={cn(
                "p-4 rounded-md border-2 transition-all cursor-pointer flex flex-col gap-4",
                targetId !== 'clear' ? "border-accent bg-accent/5" : "border-border hover:border-text-secondary/20"
              )}
              onClick={() => {
                if (targetId === 'clear') {
                  const firstOption = config.customFields
                    .find(f => f.id === currentStep.field.id)
                    ?.options?.find(o => o.id !== (currentStep as any).option.id);
                  if (firstOption) setTargetId(firstOption.id);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-text-primary">Move to another option</span>
                  <span className="text-[11px] text-text-secondary">Reassign affected tasks to an existing option</span>
                </div>
                {targetId !== 'clear' && <Check className="w-4 h-4 text-accent" />}
              </div>

              {targetId !== 'clear' && (
                <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                  <select
                    value={targetId === 'clear' ? '' : targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full bg-bg border border-border rounded-md px-4 py-3 text-[13px] text-text-primary outline-none focus:ring-2 focus:ring-accent/20 transition-all appearance-none pr-10"
                  >
                    <option value="" disabled>Select target option...</option>
                    {config.customFields
                      .find(f => f.id === currentStep.field.id)
                      ?.options?.filter(opt => opt.id !== (currentStep as any).option.id)
                      .map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))
                    }
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center bg-sidebar/30 rounded-lg px-4 py-3 border border-border/50">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            Progress
          </span>
          <div className="flex items-center gap-3">
             <div className="flex gap-1.5">
              {queue.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    i === currentIndex ? "bg-accent scale-125" : i < currentIndex ? "bg-emerald-500" : "bg-border"
                  )} 
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-text-primary tabular-nums">
              {currentIndex + 1} / {queue.length}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
