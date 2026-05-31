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
import { isWeb } from '../util/Util';
import { setVisitedScreensCallback, setResetVisitedScreensCallback } from '../util/ActionFactory';

const VISITED_SCREENS_KEY = 'visited-screens';

interface VisitedScreensContextType {
    visitedScreens: Set<string>;
    markScreenAsVisited: (screenPath: string) => void;
    isScreenVisited: (screenPath: string) => boolean;
    resetVisitedScreens: () => void;
}

const VisitedScreensContext = createContext<VisitedScreensContextType | undefined>(undefined);

export const VisitedScreensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Don't persist visited screens - start fresh each time app launches
    const [visitedScreens, setVisitedScreens] = useState<Set<string>>(new Set<string>());

    const markScreenAsVisited = useCallback((screenPath: string) => {
        setVisitedScreens((prev) => {
            const updated = new Set(prev);
            updated.add(screenPath);
            return updated;
        });
    }, []);

    const resetVisitedScreens = useCallback(() => {
        setVisitedScreens(new Set<string>());
    }, []);

    // Register callbacks so ActionFactory can mark/reset screens as visited
    useEffect(() => {
        setVisitedScreensCallback(markScreenAsVisited);
        setResetVisitedScreensCallback(resetVisitedScreens);
    }, [markScreenAsVisited, resetVisitedScreens]);

    const isScreenVisited = useCallback((screenPath: string) => {
        return visitedScreens.has(screenPath);
    }, [visitedScreens]);

    return (
        <VisitedScreensContext.Provider
            value={{ visitedScreens, markScreenAsVisited, isScreenVisited, resetVisitedScreens }}
        >
            {children}
        </VisitedScreensContext.Provider>
    );
};

export const useVisitedScreens = () => {
    const context = useContext(VisitedScreensContext);
    if (context === undefined) {
        throw new Error('useVisitedScreens must be used within a VisitedScreensProvider');
    }
    return context;
};

