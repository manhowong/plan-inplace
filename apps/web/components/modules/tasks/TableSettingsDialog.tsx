import React, { useState, useEffect, useCallback } from 'react';
import { PlanConfig } from '@packages/types/shared';
import { Modal } from '@packages/ui/Modal';
import { Button } from '@packages/ui/Button';
import { GripVertical, Eye, EyeOff, Save } from 'lucide-react';
import { cn } from '@packages/ui/utils';
import { Reorder } from 'motion/react';
import { useHotkey } from '../../../lib/useHotkey';

interface TableSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: PlanConfig;
  onSave: (config: PlanConfig) => void;
}

export function TableSettingsDialog({ isOpen, onClose, config, onSave }: TableSettingsDialogProps) {
  // Define all possible columns
  const allAvailableColumns = React.useMemo(() => [
    { id: 'title', label: 'Task' },
    { id: 'status', label: 'Status' },
    { id: 'priority', label: 'Priority' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'tags', label: 'Tags' },
    ...(config.customFields || []).filter(f => f.id !== 'status').map(f => ({ id: f.id, label: f.label }))
  ], [config.customFields]);

  // Local state for pending changes
  const [localOrder, setLocalOrder] = useState<string[]>([]);
  const [localVisibility, setLocalVisibility] = useState<Record<string, boolean>>({});

  // Initialize/Reset local state when dialog opens
  useEffect(() => {
    if (isOpen) {
      const order = config.tableView?.columnOrder || allAvailableColumns.map(c => c.id);
      // Ensure all current available columns are represented
      const fullOrder = [...order]
        .filter(id => allAvailableColumns.some(c => c.id === id))
        .concat(allAvailableColumns.filter(c => !order.includes(c.id)).map(c => c.id));
      
      setLocalOrder(fullOrder);
      setLocalVisibility(config.tableView?.columnVisibility || {});
    }
  }, [isOpen, config.tableView, allAvailableColumns]);

  // Map IDs to column objects for the Reorder component
  const sortedColumns = localOrder.map(id => allAvailableColumns.find(c => c.id === id)).filter(Boolean) as { id: string, label: string }[];

  const toggleVisibility = (id: string) => {
    setLocalVisibility(prev => ({
      ...prev,
      [id]: prev[id] === false ? true : false
    }));
  };

  const handleSave = useCallback(() => {
    onSave({
      ...config,
      tableView: {
        columnOrder: localOrder,
        columnVisibility: localVisibility
      }
    });
    onClose();
  }, [onSave, config, localOrder, localVisibility, onClose]);

  // Handle Ctrl+S shortcut
  useHotkey('s', handleSave, { ctrlKey: true, metaKey: true, enabled: isOpen });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Table Settings"
      className="min-w-[350px] max-w-[400px]"
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
      <div className="space-y-4">
        <p className="text-[13px] text-text-secondary leading-relaxed px-1">
          Drag columns to reorder them.
        </p>

        <div className="border border-border rounded-md overflow-hidden bg-sidebar">
          <Reorder.Group 
            axis="y" 
            values={sortedColumns} 
            onReorder={(newOrder) => setLocalOrder(newOrder.map(c => c.id))}
            className="divide-y divide-border"
          >
            {sortedColumns.map((col) => {
              const isVisible = localVisibility[col.id] !== false;
              
              return (
                <Reorder.Item 
                  key={col.id} 
                  value={col}
                  className={cn(
                    "flex items-center gap-3 p-3 bg-sidebar hover:bg-card transition-colors cursor-default select-none group",
                    !isVisible && "opacity-50"
                  )}
                >
                  <div className="flex items-center justify-center w-5 h-5 text-text-secondary/20 group-hover:text-text-secondary/50 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <span className="flex-1 text-[13px] font-medium text-text-primary">
                    {col.label}
                  </span>

                  <button
                    onClick={() => toggleVisibility(col.id)}
                    className={cn(
                      "p-1.5 rounded-md transition-all",
                      isVisible 
                        ? "text-accent hover:bg-sidebar" 
                        : "text-text-secondary hover:text-text-primary hover:bg-sidebar"
                    )}
                    title={isVisible ? "Hide Column" : "Show Column"}
                  >
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>
      </div>
    </Modal>
  );
}
