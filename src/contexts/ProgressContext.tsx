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

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProgressData, ScreenProgress, getProgress, getScreenProgress, getScreenCompletionPercentage } from '../services/ProgressService';
import { setRefreshProgressCallback } from '../util/ActionFactory';

interface ProgressContextType {
  progress: ProgressData;
  getScreenProgress: (screenPath: string) => ScreenProgress | null;
  isScreenVisited: (screenPath: string) => boolean;
  getCompletionPercentage: (screenPath: string) => Promise<number>;
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressData>({});

  const refreshProgress = useCallback(async () => {
    const progressData = await getProgress();
    setProgress(progressData);
  }, []);

  useEffect(() => {
    refreshProgress();
    // Register callback so ActionFactory can refresh progress after navigation
    setRefreshProgressCallback(refreshProgress);
  }, [refreshProgress]);

  const getScreenProgressData = useCallback((screenPath: string) => {
    return progress[screenPath] || null;
  }, [progress]);

  const isScreenVisited = useCallback((screenPath: string) => {
    return screenPath in progress;
  }, [progress]);

  const getCompletionPercentage = useCallback(async (screenPath: string) => {
    return await getScreenCompletionPercentage(screenPath);
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        getScreenProgress: getScreenProgressData,
        isScreenVisited,
        getCompletionPercentage,
        refreshProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

