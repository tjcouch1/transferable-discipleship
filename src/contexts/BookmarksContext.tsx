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
import { getBookmarks, toggleBookmark as toggleBookmarkService } from '../services/BookmarkService';

interface BookmarksContextType {
  bookmarks: Set<string>;
  isBookmarked: (screenPath: string) => boolean;
  toggleBookmark: (screenPath: string) => Promise<boolean>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const refreshBookmarks = useCallback(async () => {
    const bookmarkList = await getBookmarks();
    setBookmarks(new Set(bookmarkList.map(b => b.screenPath)));
  }, []);

  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  const isBookmarkedCheck = useCallback((screenPath: string) => {
    return bookmarks.has(screenPath);
  }, [bookmarks]);

  const toggleBookmarkHandler = useCallback(async (screenPath: string) => {
    const success = await toggleBookmarkService(screenPath);
    if (success) {
      await refreshBookmarks();
    }
    return success;
  }, [refreshBookmarks]);

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        isBookmarked: isBookmarkedCheck,
        toggleBookmark: toggleBookmarkHandler,
        refreshBookmarks,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};

