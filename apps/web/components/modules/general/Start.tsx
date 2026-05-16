import { 
  Pencil, 
  FolderOpen,
  Clock, 
  ChevronRight
} from 'lucide-react';
import logo from '@assets/images/logo.png';
import logoWhite from '@assets/images/logo-white.png';
import { motion } from 'motion/react';
import { ANIMATION_TRANSITIONS } from '@packages/ui/constants';
import { Badge } from '@packages/ui/Badge';
import { UI_MESSAGES } from '@packages/types/messages';
import { usePlan } from '@packages/storage/PlanContext';

/* -------------------------------------------------------------------------- */
/* Component: Start (The Landing Page)                                       */
/* -------------------------------------------------------------------------- */

export function Start() {
  const { 
    bookmarks: recentPlans, 
    lastPlan, 
    openPlan: onOpenPlan, 
    createPlan: onCreatePlan, 
    openBookmark: onOpenRecent,
    globalTheme
  } = usePlan();
  
  const currentLogo = globalTheme === 'dark' ? logoWhite : logo;

  return (
    <div className="bg-bg flex flex-col items-center justify-center px-[6%] py-[6%] overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ANIMATION_TRANSITIONS.default}
        className="max-w-5xl w-full space-y-2"
      >
        {/* Header */}
        <div className="flex items-center">
          <img src={currentLogo} alt="Plan InPlace Logo" className="h-16 object-contain" />
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-wrap gap-8 items-start">
          
          {/* Left Column: Actions */}
          <div className="flex-1 basis-[300px] mt-6">
            <div className="flex items-center mb-6 gap-2 text-primary">
              <h2 className="text-xl font-bold">Quick Start</h2>
            </div>

            {/* Create Plan */}
            <div className="relative group mb-8">
              {/* Background card stack */}
              <div className="absolute inset-0 bg-sidebar border border-border rounded-md rotate-[2deg] translate-x-1 translate-y-1 transition-transform duration-300 group-hover:rotate-[4deg]" />
              <div className="absolute inset-0 bg-sidebar border border-border rounded-md -rotate-[1deg] -translate-x-0.5 -translate-y-0.5 transition-transform duration-300 group-hover:-rotate-[2deg]" />
              
              <button
                onClick={onCreatePlan}
                className="relative w-full py-8 px-6 bg-sidebar border border-border rounded-md text-left hover:bg-card transition-all duration-200 z-10 flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-md bg-accent text-white flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:bg-[#2ebc98] mt-1">
                  <Pencil className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-text-primary">{UI_MESSAGES.STATIC.START.CREATE_TITLE}</h3>
                  <p className="text-sm text-text-primary">
                    Choose a storage location.<br/> 
                    A <code>plan-inplace</code> folder will be created.
                  </p>
                </div>
              </button>
            </div>

            {/* Open Plan */}
            <div className="relative group mb-8">
              {/* Background card stack */}
              <div className="absolute inset-0 bg-sidebar border border-border rounded-md rotate-[-2deg] translate-x-0.5 translate-y-1 transition-transform duration-300 group-hover:rotate-[-4deg]" />
              <div className="absolute inset-0 bg-sidebar border border-border rounded-md rotate-[1deg] -translate-x-1 -translate-y-0.5 transition-transform duration-300 group-hover:rotate-[2deg]" />
              
              <button
                onClick={onOpenPlan}
                className="relative w-full py-8 px-6 bg-sidebar border border-border rounded-md text-left hover:bg-card transition-all duration-200 z-10 flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-md bg-transparent border border-accent text-accent flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:bg-accent/20 mt-1">
                  <FolderOpen className="w-6 h-6 group-hover:text-accent transition-colors" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-text-primary">{UI_MESSAGES.STATIC.START.OPEN_TITLE}</h3>
                  <p className="text-sm text-text-primary leading-normal">
                    Select either the <code>plan-inplace</code> folder or its parent directory.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Recent Plans */}
          <div className="flex-1 basis-[300px] mt-6">
            <div className="flex items-center mb-6 gap-2 text-primary">
              <Clock className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-bold">{UI_MESSAGES.STATIC.START.RECENT_TITLE}</h2>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[58dvh] overflow-y-auto pr-2 pb-1">
              {recentPlans.length > 0 ? (
                recentPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="group flex items-center gap-4 p-4 bg-transparent border border-border rounded-md hover:border-accent transition-all duration-200 cursor-pointer"
                    onClick={() => onOpenRecent(plan)}
                  >
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-base text-text-primary">{plan.name}</h4>
                      </div>

                      <p className="text-xs text-text-secondary/70 truncate font-sans">
                        {new Date(plan.lastOpened).toLocaleString()}
                      </p>
                    </div>

                    {lastPlan?.id === plan.id && (
                      <Badge>Last Viewed</Badge>
                    )}

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-6 h-6 text-accent opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                  <p className="text-sm text-text-secondary">{UI_MESSAGES.STATIC.START.RECENT_EMPTY}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
