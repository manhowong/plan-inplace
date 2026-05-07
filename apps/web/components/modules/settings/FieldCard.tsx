import { Reorder } from 'motion/react';
import { ChevronDown, Trash2, GripVertical, Plus, X } from 'lucide-react';
import { Button } from '@packages/ui/Button';
import { CustomField } from '@packages/types/shared';
import { cn } from '@packages/ui/utils';
import { ColorSwatch, ConfigField } from './SettingsComponents';

/**
 * --------------------------------------------------------------------------
 * Types
 * --------------------------------------------------------------------------
 */

interface FieldCardProps {
  field: CustomField;
  index: number;
  isError: boolean;
  onUpdate: (index: number, updates: Partial<CustomField>) => void;
  onRemove: (index: number) => void;
}

/**
 * --------------------------------------------------------------------------
 * Component: FieldCard
 * --------------------------------------------------------------------------
 */

export function FieldCard({ field, index, isError, onUpdate, onRemove }: FieldCardProps) {
  return (
    <div 
      className={cn(
        "p-6 bg-sidebar rounded-md border border-border space-y-6 transition-all duration-300",
        isError && "bg-priority-high/20 border-priority-high/40 ring-1 ring-priority-high/20"
      )}
    >
      <div className="flex items-start justify-between gap-6">
        {field.id === 'status' && (
          <div className="flex items-center justify-between">
             <label className="text-[11px] font-semibold text-text-secondary uppercase">
              Status
            </label>
          </div>
        )}

        {field.id !== 'status' && (
          <div className="flex-1 grid grid-cols-2 gap-6">
            <ConfigField label="Field Label">
              <input
                type="text"
                value={field.label}
                onChange={(e) => onUpdate(index, { label: e.target.value })}
                className="w-full bg-bg border border-border rounded-md px-3 py-1.5 text-[13px] focus:ring-1 focus:ring-accent focus:border-accent outline-none disabled:opacity-50"
              />
            </ConfigField>

            <ConfigField label="Field Type">
              <div className="relative">
                <select
                  value={field.type}
                  onChange={(e) => {
                    const type = e.target.value as any;
                    onUpdate(index, { 
                      type, 
                      options: type === 'select' ? (field.options || [{ id: crypto.randomUUID(), label: 'Option 1', color: 'slate' }]) : undefined 
                    });
                  }}
                  className="w-full bg-bg border border-border rounded-md px-3 py-1.5 text-[13px] focus:ring-1 focus:ring-accent focus:border-accent outline-none disabled:opacity-50 appearance-none pr-8"
                >
                  <option value="text">Text</option>
                  <option value="select">Dropdown</option>
                  <option value="date">Date</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none opacity-60" />
              </div>
            </ConfigField>
          </div>
        )}

        {field.id !== 'status' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="mt-6 text-text-secondary hover:text-priority-high"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>



      {field.type === 'select' && (
        <div className="space-y-1">
          {field.id !== 'status' && (
            <label className="text-[11px] font-semibold text-text-secondary uppercase">
              Options
            </label>
          )}                      
          <Reorder.Group 
            axis="y" 
            values={field.options || []} 
            onReorder={(newOpts) => onUpdate(index, { options: newOpts })}
            className="space-y-2"
          >
            {field.options?.map((opt, optIndex) => (
              <Reorder.Item 
                key={opt.id} 
                value={opt}
                className="bg-bg border border-border rounded-md px-3 py-2 flex items-center gap-3 group/opt hover:border-text-secondary/30 transition-colors"
              >
                <GripVertical className="w-3.5 h-3.5 text-text-secondary opacity-30 group-hover/opt:opacity-100 cursor-grab active:cursor-grabbing shrink-0" />
                
                <ColorSwatch 
                  color={opt.color} 
                  onSelect={(c) => {
                    const next = [...(field.options || [])];
                    next[optIndex] = { ...opt, color: c };
                    onUpdate(index, { options: next });
                  }} 
                />

                <input
                  type="text"
                  value={opt.label}
                  onChange={(e) => {
                    const next = [...(field.options || [])];
                    next[optIndex] = { ...opt, label: e.target.value };
                    onUpdate(index, { options: next });
                  }}
                  className="flex-1 bg-transparent border-none p-0 text-[13px] focus:ring-0 outline-none"
                  placeholder="Option label..."
                />

                <button
                  onClick={() => {
                    const next = (field.options || []).filter((_, i) => i !== optIndex);
                    onUpdate(index, { options: next });
                  }}
                  className="p-1 text-text-secondary hover:text-priority-high opacity-0 group-hover/opt:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const id = crypto.randomUUID();
              const nextOptions = [...(field.options || []), { id, label: '', color: 'slate' }];
              onUpdate(index, { options: nextOptions });
            }}
            className="w-full py-2 border-dashed bg-transparent hover:bg-sidebar"
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            Add New Option
          </Button>
        </div>
      )}
    </div>
  );
}
