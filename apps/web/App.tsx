/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { PlanProvider, usePlan } from '@packages/storage/PlanContext';
import { PlanSettings, PlanSettingsActions } from './components/modules/settings/PlanSettings';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AppDialogs } from './components/layout/AppDialogs';
import { Start } from './components/modules/general/Start';
import { Help } from './components/modules/general/Help';
import { About } from './components/modules/general/About';
import { BoardView } from './components/modules/tasks/BoardView';
import { TableView } from './components/modules/tasks/TableView';
import { RecentPlan } from '@packages/types/shared';
import { cn } from '@packages/ui/utils';
import { Button } from '@packages/ui/Button';

// --------------------------------------------------------------------------
// Component: App
// --------------------------------------------------------------------------

/**
 * --------------------------------------------------------------------------
 * App Entry Point
 * --------------------------------------------------------------------------
 */

export default function App() {
  // --- Refs ---
  const settingsRef = useRef<PlanSettingsActions>(null);

  return (
    <PlanProvider>
      <AppInner 
        settingsRef={settingsRef} 
      />
    </PlanProvider>
  );
}

function AppInner({ 
  settingsRef, 
}: { 
  settingsRef: React.RefObject<PlanSettingsActions | null>, 
}) {
  const { 
    isReady,
    globalTheme,
    currentModule,
    currentView,
    setCurrentModule,
    setCurrentScope,
    setCurrentView,
    openBookmark,
    openPlan,
    createPlan,
    clearPlan,
    directoryName,
    metadata,
    directoryPath,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  } = usePlan();

  const [pendingNavigation, setPendingNavigation] = useState<{ module?: 'tasks' | 'settings' | 'help' | 'start' | 'about', scope?: 'active' | 'archived', view?: 'board' | 'list', bookmark?: RecentPlan, action?: 'open' | 'create' } | null>(null);
  const [showOfflineReady, setShowOfflineReady] = useState(false);
  const [showUpdateAvailable, setShowUpdateAvailable] = useState(false);

  const { updateServiceWorker } = useRegisterSW({
    onOfflineReady() {
      setShowOfflineReady(true);
    },
    onNeedRefresh() {
      setShowUpdateAvailable(true);
    },
    registerType: 'prompt',
  });

  useEffect(() => {
    if (isReady) {
      setCurrentModule('tasks');
      setCurrentScope('active');
    }
  }, [isReady, directoryName, setCurrentModule, setCurrentScope]);

  useEffect(() => {
    const onJumpModule = (event: Event) => {
      const custom = event as CustomEvent<string>;
      if (custom.detail === 'settings' && isReady) {
        setCurrentModule('settings');
      }
    };
    window.addEventListener('plan-inplace-jump-module', onJumpModule as EventListener);
    return () => window.removeEventListener('plan-inplace-jump-module', onJumpModule as EventListener);
  }, [isReady, setCurrentModule]);

  const confirmNavigation = (nav: any) => {
    if (currentModule === 'settings' && settingsRef.current?.isDirty()) {
      setPendingNavigation(nav);
      return false;
    }
    return true;
  };

  const handleNavigate = (nav: any) => {
    if (!nav) return;
    if (nav.module) {
      setCurrentModule(nav.module);
      if (nav.module === 'start') {
        clearPlan();
      }
    }
    if (nav.scope) setCurrentScope(nav.scope);
    if (nav.view) setCurrentView(nav.view);
    if (nav.action === 'open') openPlan();
    if (nav.action === 'create') createPlan();
    if (nav.bookmark) {
      openBookmark(nav.bookmark);
      setCurrentModule('tasks');
      setCurrentScope('active');
    }
    setPendingNavigation(null);
  };

  // --- Render Mappings (UI Modules (main screen) to be rendered: Help, Start, PlanSettings, BoardView, TableView ) ---
  const Screen = useMemo(() => {
    if (currentModule === 'help') return <Help />;
    if (currentModule === 'about') return <About />;
    if (!isReady || !metadata || currentModule === 'start') return <div className="h-full"><Start /></div>;
    
    if (currentModule === 'settings') {
      return (
        <div className="h-full overflow-hidden">
          <PlanSettings key={directoryPath} ref={settingsRef} />
        </div>
      );
    }
    
    if (currentView === 'board') return <div className="h-full"><BoardView /></div>;
    
    return (
      <div className="h-full overflow-auto bg-bg">
        <TableView />
      </div>
    );
  }, [currentModule, currentView, isReady, metadata, directoryPath, settingsRef]);

  // Return top-level UI components: Sidebar + content (Header + Screen)
  return (
    <div className={cn("h-screen flex overflow-hidden bg-bg text-text-primary font-sans", globalTheme)}>
      <Sidebar 
        setCurrentView={(v) => confirmNavigation({ view: v }) && setCurrentView(v)}
        setCurrentModule={(m) => {
          if (confirmNavigation({ module: m })) {
            setCurrentModule(m);
            if (m === 'start') {
              clearPlan();
            }
          }
        }}
        setCurrentScope={(s) => confirmNavigation({ scope: s }) && setCurrentScope(s)}
        openBookmark={(plan) => {
          if (confirmNavigation({ bookmark: plan })) {
            openBookmark(plan);
            setCurrentModule('tasks');
            setCurrentScope('active');
          }
        }}
        openPlan={() => confirmNavigation({ action: 'open' }) && openPlan()}
        createPlan={() => confirmNavigation({ action: 'create' }) && createPlan()}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {isReady && (
          <Header 
            onSaveConfig={() => settingsRef.current?.save()} 
            onDiscardConfig={() => settingsRef.current?.reset()} 
          />
        )}

        <main className="flex-1 overflow-y-auto bg-bg">
           {Screen}
        </main>
      </div>

      {showOfflineReady && (
        <div className="fixed bottom-4 right-4 z-[100] max-w-sm rounded-xl border border-border bg-card px-4 py-3 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">Offline ready</p>
              <p className="mt-1 text-xs text-text-secondary">The app assets are cached for offline use.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowOfflineReady(false)}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showUpdateAvailable && (
        <div className="fixed bottom-4 left-4 z-[100] max-w-sm rounded-xl border border-border bg-card px-4 py-3 shadow-xl">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">New version available</p>
              <p className="mt-1 text-xs text-text-secondary">A new version is ready. Refresh to update now.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => updateServiceWorker(true)}>
                Update
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowUpdateAvailable(false)}>
                Later
              </Button>
            </div>
          </div>
        </div>
      )}

      <AppDialogs 
        pendingNavigation={pendingNavigation}
        setPendingNavigation={setPendingNavigation}
        onCancelNavigation={() => setPendingNavigation(null)}
        onConfirmNavigation={handleNavigate}
      />
    </div>
  );
}
