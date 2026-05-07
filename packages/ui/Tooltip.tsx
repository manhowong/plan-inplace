import React from 'react';
import { cn } from './utils';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  tooltipClassName?: string;
  noRelative?: boolean;
}

export function Tooltip({ children, content, position = 'top', className, tooltipClassName, noRelative }: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1 border-t-text-primary",
    bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-text-primary",
    left: "left-full top-1/2 -translate-y-1/2 -ml-1 border-l-text-primary",
    right: "right-full top-1/2 -translate-y-1/2 -mr-1 border-r-text-primary"
  };

  return (
    <div className={cn(!noRelative && "relative", "group/tooltip", className)}>
      {children}
      <div className={cn(
        "absolute opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[100] shadow-lg px-2 py-1 bg-text-primary text-bg text-[10px] font-bold rounded",
        positionClasses[position],
        tooltipClassName
      )}>
        {content}
        <div className={cn(
          "absolute border-4 border-transparent",
          arrowClasses[position]
        )} />
      </div>
    </div>
  );
}
