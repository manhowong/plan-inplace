// --------------------------------------------------------------------------
// Metadata
// --------------------------------------------------------------------------

export const ROOT_FOLDER_NAME = 'plan-inplace';

export const METADATA_FILE = 'metadata.json';
export const PLAN_FILE = 'plan.json';

// --------------------------------------------------------------------------
// Defaults
// --------------------------------------------------------------------------

export const DEFAULT_STATUS_OPTIONS = [
  { id: 'opt_default_1', label: 'Todo', color: 'yellow' },
  { id: 'opt_default_2', label: 'In Progress', color: 'blue' },
  { id: 'opt_default_3', label: 'Done', color: 'emerald' }
];

export const DEFAULT_PLAN_CONFIG = {
  customFields: [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: DEFAULT_STATUS_OPTIONS
    }
  ]
  
};

export const PRIORITIES = ['Unassigned', 'Low', 'Medium', 'High'] as const;
export const PRIORITY_WEIGHTS: Record<string, number> = { 
  'Unassigned': 1, 
  'Low': 2, 
  'Medium': 3, 
  'High': 4 
};

export const INITIAL_RANK = 1024;
export const GAP = 1024;

