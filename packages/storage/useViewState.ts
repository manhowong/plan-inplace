import { useState, useEffect } from 'react';

export function useViewState() {
  const [globalTheme, setGlobalTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('plan-inplace_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  });

  const [currentModule, setCurrentModule] = useState<'tasks' | 'settings' | 'help' | 'start'>(() => {
    return (localStorage.getItem('plan-inplace_module') as any) || 'start';
  });

  const [currentScope, setCurrentScope] = useState<'active' | 'archived'>(() => {
    return (localStorage.getItem('plan-inplace_scope') as any) || 'active';
  });

  const [currentView, setCurrentView] = useState<'board' | 'list'>(() => {
    return (localStorage.getItem('plan-inplace_view') as any) || 'board';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('plan-inplace_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('plan-inplace_theme', globalTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(globalTheme);
  }, [globalTheme]);

  useEffect(() => {
    localStorage.setItem('plan-inplace_module', currentModule);
  }, [currentModule]);

  useEffect(() => {
    localStorage.setItem('plan-inplace_scope', currentScope);
  }, [currentScope]);

  useEffect(() => {
    localStorage.setItem('plan-inplace_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('plan-inplace_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    globalTheme,
    setGlobalTheme,
    currentModule,
    setCurrentModule,
    currentScope,
    setCurrentScope,
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  };
}
