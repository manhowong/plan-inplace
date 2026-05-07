import { useState, useEffect, useCallback } from 'react';
import { PlanConfig } from '@packages/types/shared';
import { Modal } from '@packages/ui/Modal';
import { Button } from '@packages/ui/Button';
import { Save } from 'lucide-react';
import { cn } from '@packages/ui/utils';
import { usePlan } from '@packages/storage/PlanContext';
import { useHotkey } from '../../../lib/useHotkey';

interface BoardSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: PlanConfig;
  onSave: (config: PlanConfig) => void;
}

export function BoardSettingsDialog({ isOpen, onClose, config, onSave }: BoardSettingsDialogProps) {
  const [groupBy, setGroupBy] = useState<'status' | 'priority'>(config.boardView?.groupBy || 'status');
  const { setCurrentModule } = usePlan(); // for the Plan Settings link

  useEffect(() => {
    if (isOpen) {
      setGroupBy(config.boardView?.groupBy || 'status');
    }
  }, [isOpen, config.boardView]);

  const handleSave = useCallback(() => {
    onSave({
      ...config,
      boardView: {
        ...config.boardView,
        groupBy
      }
    });
    onClose();
  }, [onSave, config, groupBy, onClose]);
  
  // Handle Ctrl+S shortcut
  useHotkey('s', handleSave, { ctrlKey: true, metaKey: true, enabled: isOpen });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Board Settings"
      className="max-w-[400px]"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      }
    >
      <div className="space-y-6">

        <div className="space-y-6">
          <p className="text-[13px] mb-3 text-text-secondary">
            Group Tasks By...
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGroupBy('status')}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-md border-2 transition-all text-center",
                groupBy === 'status' 
                  ? "bg-accent/15 border-accent text-accent" 
                  : "bg-sidebar border-border/50 hover:border-border hover:bg-sidebar/50"
              )}
            >
              <div className="text-[13px] text-text-primary font-bold">Status</div>
              <div className="text-[11px] text-text-secondary">Column order:<br/>Same as listed*</div>
            </button>

            <button
              onClick={() => setGroupBy('priority')}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-md border-2 transition-all text-center",
                groupBy === 'priority' 
                  ? "bg-accent/15 border-accent text-accent" 
                  : "bg-sidebar border-border/50 hover:border-border hover:bg-sidebar/50"
              )}
            >
              <div className="text-[13px] text-text-primary font-bold">Priority</div>
              <div className="text-[11px] text-text-secondary">Column order:<br/>High to low priority</div>
            </button>
          </div>
          <div className="text-[11px] text-text-secondary">
            
            * To change the status order, go to 
            <span
              onClick={() => {
                setCurrentModule('settings');
                onClose();
              }}
              className="pl-1 text-accent hover:underline cursor-pointer"
            >
              Plan Settings
            </span>.
          </div>
        </div>
      </div>
    </Modal>
  );
}
