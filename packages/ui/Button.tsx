import React from 'react';
import { cn } from './utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

/**
 * Atomic Button Component
 * 
 * A reusable button component with multiple variants and sizes, 
 * styled using Tailwind CSS and utility classes.
 */
export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-accent text-white hover:bg-[#2ebc98] border border-accent/20',
    secondary: 'bg-transparent border border-accent text-accent hover:bg-accent/20 transition-colors',
    outline: 'bg-transparent border border-border text-text-primary hover:bg-sidebar',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-sidebar-active',
    danger: 'bg-transparent border border-border text-priority-high hover:bg-priority-high hover:text-white',
  };

  const sizes = {
    sm: 'px-2 py-1 text-[12px] font-medium rounded-md',
    md: 'px-3 py-1.5 text-[13px] font-medium rounded-md',
    lg: 'px-4 py-2 text-[14px] font-medium rounded-md',
    icon: 'p-1.5 rounded-md',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
