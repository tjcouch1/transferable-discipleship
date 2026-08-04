/**
 * Copyright (C) 2023 TJ Couch
 * This file is part of discipleship‑app‑template.
 *
 * discipleship‑app‑template is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * discipleship‑app‑template is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with discipleship‑app‑template. If not, see <http://www.gnu.org/licenses/>.
 */

import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import {
  ProgressMap,
  loadProgress,
  saveProgress,
  withVisit,
} from '../services/ProgressService';
import { getAppScreens } from '../services/ScreenService';

type ProgressContextValue = {
  /** Whether the screen at this path has ever been visited */
  isVisited: (screenPath: string) => boolean;
  /**
   * Percentage (0-100) of this screen's leaf descendants (the content pages
   * anywhere beneath it) that have been visited, or undefined if it has none
   */
  completion: (screenPath: string) => number | undefined;
  /** Record a visit to the screen at this path (persists) */
  markVisited: (screenPath: string) => void;
  /** Clear all visit records (persists) */
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextValue>({
  isVisited: () => false,
  completion: () => undefined,
  markVisited: () => {},
  resetProgress: () => {},
});

/**
 * All leaf-screen paths beneath a screen — content pages anywhere in its
 * subtree that have no subscreens of their own. A leaf itself has no
 * descendants (returns []). Cached: the screen map is immutable after load.
 */
const leafDescendantCache = new Map<string, string[]>();
function getLeafDescendantPaths(screenPath: string): string[] {
  const cached = leafDescendantCache.get(screenPath);
  if (cached) return cached;
  const screen = getAppScreens().screens.get(screenPath);
  const leaves: string[] = [];
  // Screen map subscreen entries keep their original (short) ids
  (screen?.subscreens ?? []).forEach(sub => {
    const subPath = `${screenPath}/${sub.id}`;
    const subLeaves = getLeafDescendantPaths(subPath);
    if (subLeaves.length === 0) leaves.push(subPath);
    else leaves.push(...subLeaves);
  });
  leafDescendantCache.set(screenPath, leaves);
  return leaves;
}

/** Tracks which screens the user has visited. Persists across sessions. */
export const ProgressProvider = ({ children }: PropsWithChildren) => {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await loadProgress();
      if (cancelled) return;
      setProgress(current => {
        const merged = { ...saved, ...current };
        // If a visit was recorded before this load resolved, its save wrote a
        // partial map that clobbered `saved` on disk; re-persist the union so
        // those earlier-session visits aren't lost.
        if (Object.keys(current).length > 0) saveProgress(merged);
        return merged;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markVisited = useCallback((screenPath: string) => {
    setProgress(current => {
      // Already visited: keep the same reference so no consumer re-renders and
      // no redundant write fires — only set membership drives the UI.
      if (screenPath in current) return current;
      const updated = withVisit(current, screenPath);
      // Fire-and-forget persistence; failures only affect the next launch
      saveProgress(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
    saveProgress({});
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      isVisited: screenPath => screenPath in progress,
      completion: screenPath => {
        const leaves = getLeafDescendantPaths(screenPath);
        if (leaves.length === 0) return undefined;
        const visited = leaves.filter(path => path in progress).length;
        return Math.round((visited / leaves.length) * 100);
      },
      markVisited,
      resetProgress,
    }),
    [progress, markVisited, resetProgress],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

/** Get visited-screen tracking (no-ops outside a ProgressProvider) */
export function useProgress(): ProgressContextValue {
  return useContext(ProgressContext);
}

/**
 * Marks the current screen visited whenever it gains focus. Call once from each
 * screen wrapper: this is the single place visits are recorded, so every
 * arrival — forward navigation, Previous/Next, breadcrumb, back gesture, or a
 * restored/deep-linked route — is captured without scattering markVisited
 * across navigation call sites.
 */
export function useMarkVisitedOnFocus(): void {
  const route = useRoute();
  const { markVisited } = useProgress();
  useFocusEffect(
    useCallback(() => {
      markVisited(route.name);
    }, [route.name, markVisited]),
  );
}
