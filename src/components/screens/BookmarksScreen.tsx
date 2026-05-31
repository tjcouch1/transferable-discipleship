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

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../../contexts/BookmarksContext';
import { getBookmarks, removeBookmark, Bookmark } from '../../services/BookmarkService';
import TScrollView from '../TScrollView';
import { Header } from '../contents/Header';

/** Screen that displays all bookmarked screens */
export const BookmarksScreen = ({}: NativeStackScreenProps<any>) => {
  const navigation = useNavigation();
  const { refreshBookmarks } = useBookmarks();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setIsLoading(true);
    const bookmarkList = await getBookmarks();
    // Sort by most recently bookmarked
    bookmarkList.sort((a, b) => b.bookmarkedAt - a.bookmarkedAt);
    setBookmarks(bookmarkList);
    setIsLoading(false);
  };

  const handleRemoveBookmark = async (screenPath: string) => {
    await removeBookmark(screenPath);
    await loadBookmarks();
    await refreshBookmarks();
  };

  const handleNavigate = (screenPath: string) => {
    navigation.navigate(screenPath);
  };

  return (
    <TScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Header
          headerText="Bookmarks"
          lineTexts={['Your saved screens']}
        />
        {isLoading ? (
          <Text style={styles.loadingText}>Loading bookmarks...</Text>
        ) : bookmarks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookmarks yet</Text>
            <Text style={styles.emptySubtext}>
              Bookmark screens you want to revisit later
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {bookmarks.map((bookmark, index) => (
              <View key={bookmark.screenPath} style={styles.bookmarkItem}>
                <TouchableOpacity
                  style={styles.bookmarkContent}
                  onPress={() => handleNavigate(bookmark.screenPath)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.bookmarkTitle}>{bookmark.title}</Text>
                  <Text style={styles.bookmarkPath}>{bookmark.screenPath}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveBookmark(bookmark.screenPath)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </TScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    marginTop: 16,
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bookmarkContent: {
    flex: 1,
  },
  bookmarkTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bookmarkPath: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  removeButtonText: {
    color: '#C62828',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

