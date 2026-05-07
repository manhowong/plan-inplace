import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OPTION_COLORS } from './constants';

export { OPTION_COLORS };

/**
 * Utility: cn (Class Name)
 * Safely merges Tailwind CSS classes using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COLOR_BG_MAP: Record<typeof OPTION_COLORS[number], string> = {
  slate: 'bg-option-slate/80',
  neutral: 'bg-option-neutral',
  red: 'bg-option-red',
  orange: 'bg-option-orange',
  amber: 'bg-option-amber',
  yellow: 'bg-option-yellow',
  lime: 'bg-option-lime',
  green: 'bg-option-green',
  emerald: 'bg-option-emerald',
  teal: 'bg-option-teal',
  cyan: 'bg-option-cyan',
  blue: 'bg-option-blue',
  indigo: 'bg-option-indigo',
  violet: 'bg-option-violet',
  fuchsia: 'bg-option-fuchsia',
};
