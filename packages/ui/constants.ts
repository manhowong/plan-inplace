/**
 * UI Specific Constants
 * These are strictly for the React layer (animations, transitions, etc.)
 */

export const ANIMATION_TRANSITIONS = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30
  },
  default: {
    duration: 0.2,
    ease: "easeOut"
  },
  modal: {
    type: "spring",
    damping: 25,
    stiffness: 300
  }
} as const;

export const OPTION_COLORS = [
  'slate',
  'neutral',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'violet',
  'fuchsia',
] as const;
