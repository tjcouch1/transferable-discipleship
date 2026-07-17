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
   * Percentage (0-100) of this screen's direct subscreens that have been
   * visited, or undefined if the screen has no subscreens
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

/** Paths of a screen's direct subscreens according to the app screen map */
function getSubscreenPaths(screenPath: string): string[] {
  const screen = getAppScreens().screens.get(screenPath);
  // Screen map subscreen entries keep their original (short) ids
  return (screen?.subscreens ?? []).map(sub => `${screenPath}/${sub.id}`);
}

/** Tracks which screens the user has visited. Persists across sessions. */
export const ProgressProvider = ({ children }: PropsWithChildren) => {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await loadProgress();
      if (!cancelled) setProgress(current => ({ ...saved, ...current }));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markVisited = useCallback((screenPath: string) => {
    setProgress(current => {
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
        const subscreenPaths = getSubscreenPaths(screenPath);
        if (subscreenPaths.length === 0) return undefined;
        const visited = subscreenPaths.filter(path => path in progress).length;
        return Math.round((visited / subscreenPaths.length) * 100);
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
