import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn, OPTION_COLORS, COLOR_BG_MAP } from '@packages/ui/utils';

/**
 * --------------------------------------------------------------------------
 * Component: ColorSwatch
 * --------------------------------------------------------------------------
 */

export function ColorSwatch({ color, onSelect }: { color: string; onSelect: (c: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const colorBgs = COLOR_BG_MAP;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "w-5 h-5 rounded-full border-2 border-white transition-all hover:scale-110 shrink-0",
          colorBgs[color] || 'bg-option-slate'
        )}
      />
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[110]" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
            }} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute left-0 top-full mt-2 p-3 bg-card border border-border rounded-xl shadow-2xl z-[120] grid grid-cols-5 gap-2 min-w-[160px]"
          >
            <div className="absolute -top-1.5 left-2 w-3 h-3 bg-card border-t border-l border-border rotate-45" />
            
            {OPTION_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(c);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-6 h-6 rounded-full border border-black/10 hover:scale-125 transition-all relative group",
                  colorBgs[c],
                  c === color && "ring-2 ring-accent ring-offset-2 ring-offset-card"
                )}
                title={c}
              >
                {c === color && (
                  <Check className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow-sm" />
                )}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

/**
 * --------------------------------------------------------------------------
 * Component: ConfigField
 * --------------------------------------------------------------------------
 */

export function ConfigField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-[11px] font-bold uppercase text-text-secondary pl-1">
        {label}
      </label>
      <div className="relative group">
        {children}
      </div>
    </div>
  );
}
