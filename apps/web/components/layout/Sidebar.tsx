import {
  BriefcaseBusiness,
  Archive,
  FolderOpen,
  Moon,
  Sun,
  Settings,
  Map,
  Pencil,
  X,
  HelpCircle,
  Info,
  PanelLeft,
  Home,
  LayoutDashboard,
  Rows3
} from 'lucide-react';
import icon from '@assets/images/icon.png';
import { cn } from '@packages/ui/utils';
import { UI_MESSAGES } from '@packages/types/messages';
import { RecentPlan } from '@packages/types/shared';
import { Button } from '@packages/ui/Button';
import { Tooltip } from '@packages/ui/Tooltip';
import { usePlan, useConfirm } from '@packages/storage/PlanContext';

interface SidebarProps {
  setCurrentView: (v: 'board' | 'list') => void;
  setCurrentModule: (m: 'tasks' | 'settings' | 'help' | 'start' | 'about') => void;
  setCurrentScope: (s: 'active' | 'archived') => void;
  openBookmark: (plan: RecentPlan) => void;
  openPlan: () => void;
  createPlan: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean) => void;
}

/**
 * Main Sidebar Component
 */
export function Sidebar({ 
  isSidebarCollapsed, 
  setIsSidebarCollapsed, 
  setCurrentView: setView,
  setCurrentModule: setModule,
  setCurrentScope: setScope,
  openBookmark: onOpenBookmark,
  openPlan: onOpenPlan,
  createPlan: onCreatePlan
}: SidebarProps) {
  const { 
    isReady: isPlanActive, 
    currentView, 
    currentModule, 
    globalTheme, 
    setGlobalTheme,
    tasks,
    currentScope,
    bookmarks,
    metadata,
    unlistCurrentPlan,
    removeBookmark,
    directoryName,
    clearPlan,
  } = usePlan();

  const { confirm } = useConfirm();

  return (
    <aside className={cn(
      "bg-sidebar border-r border-border flex flex-col h-screen flex-shrink-0 transition-all duration-300",
      isSidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header Section */}
      <div className={cn("border-b border-border bg-sidebar/50", isSidebarCollapsed ? "" : "p-4")}>
        <div className={cn("flex items-center truncate", isSidebarCollapsed ? "flex-col gap-4 px-4" : "mb-4 justify-between")}>
          <div className={cn("flex items-center gap-2.5 overflow-hidden", isSidebarCollapsed && "justify-center w-full")}>
            {!isSidebarCollapsed && (
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={icon} alt="Icon" className="w-full h-full object-contain" />
            </div>
            )}
            {!isSidebarCollapsed && (
              <div className="min-w-0 pr-1">
                <h1 className="text-[13px] font-semibold truncate text-text-primary leading-tight">
                  {isPlanActive ? (metadata?.name || directoryName) : 'Start planning...'}
                </h1>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={cn(
              "p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-sidebar-active transition-all duration-200"
            )}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <PanelLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Action Group */}
        <div className={cn(
          "flex items-center gap-1 bg-bg p-1 rounded-md border border-border",
          isSidebarCollapsed ? "flex-col mx-2 my-4" : ""
        )}>
          {isSidebarCollapsed ? (
            <>
              <Tooltip content={currentView === 'board' ? "Switch to Table" : "Switch to Board"} position="right">
                <button
                  onClick={() => setView(currentView === 'board' ? 'list' : 'board')}
                  disabled={!isPlanActive || currentModule === 'settings'}
                  className={cn(
                    "p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-sidebar-active transition-all duration-200",
                    (!isPlanActive || currentModule === 'settings') && "opacity-20 cursor-not-allowed"
                  )}
                >
                  {currentView === 'board' ? <Rows3 className="w-6 h-6" /> : <LayoutDashboard className="w-6 h-6" />}
                </button>
              </Tooltip>

              <Tooltip content={globalTheme === 'light' ? 'Dark Mode' : 'Light Mode'} position="right">
                <button
                  onClick={() => setGlobalTheme(globalTheme === 'light' ? 'dark' : 'light')}
                  className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-sidebar-active transition-all duration-200"
                >
                  {globalTheme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                </button>
              </Tooltip>
            </>
          ) : (
            <>
              <div className="flex flex-1 p-0.5 gap-1">
                <button
                  onClick={() => setView('board')}
                  disabled={!isPlanActive || currentModule === 'settings'}
                  className={cn(
                    "flex-1 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200",
                    currentView === 'board' ? "bg-sidebar-active text-text-primary font-semibold" : "text-text-secondary hover:text-accent font-semibold",
                    (!isPlanActive || currentModule === 'settings') && "opacity-50 cursor-not-allowed"
                  )}
                >
                  Board
                </button>
                <button
                  onClick={() => setView('list')}
                  disabled={!isPlanActive || currentModule === 'settings'}
                  className={cn(
                    "flex-1 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200",
                    currentView === 'list' ? "bg-sidebar-active text-text-primary font-semibold" : "text-text-secondary hover:text-accent font-semibold",
                    (!isPlanActive || currentModule === 'settings') && "opacity-50 cursor-not-allowed"
                  )}
                >
                  Table
                </button>
              </div>
              <div className="w-px h-4 bg-border mx-1" />
              <button
                onClick={() => setGlobalTheme(globalTheme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-sidebar-active transition-all duration-200"
                title={globalTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
              >
                {globalTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className={cn(
        "flex-1 flex flex-col min-h-0  overflow-hidden",
        isSidebarCollapsed ? "" : "py-4"
      )}>
        {/* Navigation Section */}
        <div className={isSidebarCollapsed ? "":"px-2"}>
          <SidebarNavItem
            icon={BriefcaseBusiness}
            label="Active Tasks"
            isCollapsed={isSidebarCollapsed}
            count={isPlanActive ? tasks.filter(t => !t.archived).length : undefined}
            active={isPlanActive && currentModule === 'tasks' && currentScope === 'active'}
            onClick={() => {
              if (!isPlanActive) return;
              setScope('active');
              setModule('tasks');
            }}
            className={!isPlanActive ? "opacity-30 cursor-not-allowed" : ""}
          />
          <SidebarNavItem
            icon={Archive}
            label="Completed Tasks"
            isCollapsed={isSidebarCollapsed}
            count={isPlanActive ? tasks.filter(t => !!t.archived).length : undefined}
            active={isPlanActive && currentModule === 'tasks' && currentScope === 'archived'}
            onClick={() => {
              if (!isPlanActive) return;
              setScope('archived');
              setModule('tasks');
            }}
            className={!isPlanActive ? "opacity-30 cursor-not-allowed" : ""}
          />
          <SidebarNavItem
            icon={Settings}
            label="Plan Settings"
            isCollapsed={isSidebarCollapsed}
            active={isPlanActive && currentModule === 'settings'}
            onClick={() => {
              if (!isPlanActive) return;
              setModule('settings');
            }}
            className={!isPlanActive ? "opacity-30 cursor-not-allowed" : ""}
          />
        </div>

        {/* Recent Plans Section */}
        {!isSidebarCollapsed && (
          <div className="mt-4 flex-1 flex flex-col min-h-0 border-t border-border">
            <div className="px-6 py-2 mt-2">
              <h3 className="text-[13px] font-semibold text-text-secondary select-none">Recent Plans</h3>
            </div>

            <div className="flex-1 space-y-0.5 px-2 flex flex-col overflow-y-auto">
              {bookmarks.length > 0 ? (
                bookmarks.map((plan: RecentPlan) => {
                  const isCurrent = isPlanActive && plan.id === metadata?.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => onOpenBookmark(plan)}
                      className={cn(
                        "group px-4 py-1.5 flex items-center gap-3 transition-all duration-200 rounded-md mx-2 text-text-secondary",
                        isCurrent
                          ? "text-text-primary cursor-default font-semibold"
                          : "hover:text-text-primary hover:bg-sidebar-active cursor-pointer"
                      )}
                    >
                      <Map className={cn("w-4 h-4 text-left shrink-0", isCurrent && "text-accent opacity-100")} />
                      <span className="text-[13px] flex-1 truncate text-left">{plan.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-bold shrink-0 group-hover:hidden">
                          viewing
                        </span>
                      )}
                      <Tooltip content="Remove from history" position="left" className="shrink-0 h-4 items-center hidden group-hover:flex">
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const confirmed = await confirm({
                              ...UI_MESSAGES.CONFIRMATIONS.REMOVE_PLAN,
                              message: UI_MESSAGES.CONFIRMATIONS.REMOVE_PLAN.message(plan.name),
                              variant: 'danger'
                            });
                            if (confirmed) {
                              isCurrent ? unlistCurrentPlan() : removeBookmark(plan.id);
                            }
                          }}
                          className={cn(
                            "relative z-10 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-priority-high/10 text-text-secondary hover:text-priority-high transition-all duration-150",
                            isCurrent && "group-hover:opacity-100"
                          )}
                        >
                          <X className="w-4 h-4 pointer-events-none" />
                        </button>
                      </Tooltip>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-4 text-center">
                  <p className="text-[11px] text-text-secondary/50 font-medium italic">No recent plans</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 space-y-2 text-center">
              <Button
                variant="primary"
                size="md"
                onClick={onCreatePlan}
                className="w-[calc(100%-1rem)] mx-2 justify-center text-[12px]"
              >
                <Pencil className="w-3.5 h-3.5 mr-2" />
                Create a Plan
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={onOpenPlan}
                className="w-[calc(100%-1rem)] mx-2 justify-center text-[12px]"
              >
                <FolderOpen className="w-3.5 h-3.5 mr-2" />
                Open a Plan
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      {!isSidebarCollapsed ? (
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setModule('start');
                clearPlan();
              }}
              className={cn(
                "text-[12px] font-medium transition-all duration-200 px-1 py-0.5 rounded cursor-pointer",
                currentModule === 'start' ? "text-accent" : "text-text-secondary hover:text-text-primary"
              )}
            >
              Start
            </button>
            <div className="h-4 w-[1px] bg-border mx-1" />
            <button
              onClick={() => setModule('help')}
              className={cn(
                "text-[12px] font-medium transition-all duration-200 px-1 py-0.5 rounded cursor-pointer",
                currentModule === 'help' ? "text-accent" : "text-text-secondary hover:text-text-primary"
              )}
            >
              Help
            </button>
            <div className="h-4 w-[1px] bg-border mx-1" />
            <button
              onClick={() => setModule('about')}
              className={cn(
                "text-[12px] font-medium transition-all duration-200 px-1 py-0.5 rounded cursor-pointer",
                currentModule === 'about' ? "text-accent" : "text-text-secondary hover:text-text-primary"
              )}
            >
              About
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-border pb-1 flex flex-col items-center">
          <CollapsedActionTooltip content="Start">
            <CollapsedActionButton 
              active={currentModule === 'start'}
              onClick={() => {
                setModule('start');
                clearPlan();
              }}
              icon={Home}
            />
          </CollapsedActionTooltip>
          <CollapsedActionTooltip content="Help">
            <CollapsedActionButton 
              active={currentModule === 'help'}
              onClick={() => setModule('help')}
              icon={HelpCircle}
            />
          </CollapsedActionTooltip>
          <CollapsedActionTooltip content="About">
            <CollapsedActionButton 
              active={currentModule === 'about'}
              onClick={() => setModule('about')}
              icon={Info}
            />
          </CollapsedActionTooltip>
        </div>
      )}
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared: Internal Atomic Components                                        */
/* -------------------------------------------------------------------------- */

/**
 * Shared: Sidebar Navigation Item
 */
function SidebarNavItem({ icon: Icon, label, onClick, active, count, className, isCollapsed }: any) {
  const content = (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center transition-all duration-150 cursor-pointer",
        isCollapsed 
          ? "py-3 justify-center w-full border-r-2" 
          : "px-4 py-1.5 gap-3 mx-2 rounded-md border border-transparent",
        active
          ? (isCollapsed 
              ? "bg-sidebar-active text-text-primary font-semibold border-accent" 
              : "bg-sidebar-active text-text-primary font-semibold")
          : "text-text-secondary hover:text-text-primary hover:bg-sidebar-active/40",
        !isCollapsed && !active && "border-transparent",
        isCollapsed && !active && "border-transparent",
        className
      )}
    >
      <Icon className={cn("shrink-0", isCollapsed ? "w-6 h-6" : "w-4 h-4", active ? "text-accent" : "opacity-100")} />
      {!isCollapsed && (
        <>
          <span className="text-[13px] flex-1 truncate">{label}</span>
          {count !== undefined && (
            <span className={cn(
              "text-[11px] px-2 py-0.5 rounded-full",
              active ? "bg-accent/20 text-accent font-medium" : "bg-border/60"
            )}>
              {count}
            </span>
          )}
        </>
      )}
    </div>
  );

  if (isCollapsed) {
    return <Tooltip content={label} position="right" className="w-full">{content}</Tooltip>;
  }
  return content;
}

/**
 * Shared: Collapsed state components
 */
function CollapsedActionButton({ active, onClick, icon: Icon, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex justify-center py-3 transition-all duration-200 border-r-2",
        active 
          ? "bg-sidebar-active text-accent border-accent" 
          : "text-text-secondary hover:text-text-primary hover:bg-sidebar-active/40 border-transparent",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
}

function CollapsedActionTooltip({ content, children }: any) {
  return (
    <Tooltip content={content} position="right" className="w-full">
      {children}
    </Tooltip>
  );
}
