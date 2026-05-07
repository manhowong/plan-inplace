import { useState, useCallback } from 'react';
import { RecentPlan } from '@packages/types/shared';
import { 
  getRecentPlans, 
  removeRecentPlan, 
  getLastPlanId,
  setLastPlanId
} from './bookmarkManager';

/**
 * --------------------------------------------------------------------------
 * useRecentPlans
 * --------------------------------------------------------------------------
 * Manages the collection of recently accessed plan handles and metadata.
 * Provides methods for loading, removing, and unlisting projects.
 */
export function useRecentPlans() {
  const [bookmarks, setBookmarks] = useState<RecentPlan[]>([]);
  const [lastPlan, setLastPlan] = useState<RecentPlan | null>(null);

  // --- Load Logic ---
  const loadRecentPlans = useCallback(async () => {
    const plans = await getRecentPlans();
    setBookmarks(plans);
    
    const lastId = await getLastPlanId();
    if (lastId) {
      const last = plans.find(p => p.id === lastId);
      if (last) setLastPlan(last);
    }
    return plans;
  }, []);

  // --- Retention Actions ---
  const removeBookmark = useCallback(async (id: string) => {
    await removeRecentPlan(id);
    const lastId = await getLastPlanId();
    if (lastId === id) {
      await setLastPlanId(null);
      setLastPlan(null);
    }
    await loadRecentPlans();
  }, [loadRecentPlans]);

  return {
    bookmarks,
    setBookmarks,
    lastPlan,
    setLastPlan,
    loadRecentPlans,
    removeBookmark
  };
}
