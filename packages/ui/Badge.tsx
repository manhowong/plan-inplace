import React from 'react';
import { cn } from './utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority' | 'outline' | 'option';
  priority?: 'Low' | 'Medium' | 'High' | 'Unassigned' | '';
  optionColor?: string;
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  priority,
  optionColor,
  className 
}: BadgeProps) {
  const base = "px-1.5 py-0.5 rounded-full text-[11px] font-medium inline-flex text-center items-center justify-center";
  
  const variants = {
    default: 'bg-accent text-white border-transparent whitespace-nowrap',
    outline: 'bg-tag-bg rounded text-text-secondary border border-border',
    option: 'rounded font-bold', // Note: For colors, we will use "style=" below to ensure it works with dynamic variables
    priority: {
      Low: 'bg-priority-low text-white border-transparent',
      Medium: 'bg-priority-med text-white border-transparent',
      High: 'bg-priority-high text-white border-transparent',
      Unassigned: 'hidden',
      '': 'hidden',
    }
  };

  const currentVariant = variant === 'priority' && priority 
    ? variants.priority[priority] 
    : variant === 'option'
    ? variants.option
    : variants[variant as 'default' | 'outline'];

  return (
    <span 
      className={cn(base, currentVariant, className)}
      style={variant === 'option' ? {
        backgroundColor: `color-mix(in srgb, var(--color-option-${optionColor || 'slate'}), transparent 80%)`,
        color: `var(--color-option-${optionColor || 'slate'})`,
      } : undefined}
    >
      {children}
    </span>
  );
}
