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

/**
 * EnhancedLoadingExample.tsx - Examples of improved loading states
 * 
 * This file demonstrates what enhanced loading states could look like.
 * These are examples and can be integrated into actual components like ScrRangeDisplay.
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';

/**
 * Example 1: Activity Indicator with text
 * Better than just showing "loading" text
 */
export const LoadingIndicator = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color="#007AFF" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

/**
 * Example 2: Skeleton loader
 * Shows placeholder content structure while loading
 */
export const SkeletonLoader = () => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View
        style={[
          styles.skeletonLine,
          { opacity: pulseAnim },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonLine,
          styles.skeletonLineShort,
          { opacity: pulseAnim },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonLine,
          { opacity: pulseAnim },
        ]}
      />
    </View>
  );
};

/**
 * Example 3: Scripture loading skeleton
 * Specifically designed for scripture content
 */
export const ScriptureSkeletonLoader = () => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.scriptureSkeleton}>
      <Animated.View
        style={[
          styles.skeletonReference,
          { opacity: pulseAnim },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonVerse,
          { opacity: pulseAnim },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonVerse,
          styles.skeletonVerseShort,
          { opacity: pulseAnim },
        ]}
      />
    </View>
  );
};

/**
 * Example 4: Loading with error handling
 * Shows how to handle both loading and error states
 */
export const LoadingWithError = ({
  isLoading,
  error,
  children,
}: {
  isLoading: boolean;
  error: Error | null;
  children: React.ReactNode;
}) => {
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load content</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  if (isLoading) {
    return <ScriptureSkeletonLoader />;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  skeletonContainer: {
    padding: 16,
    gap: 12,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '100%',
  },
  skeletonLineShort: {
    width: '60%',
  },
  scriptureSkeleton: {
    padding: 16,
    gap: 12,
  },
  skeletonReference: {
    height: 18,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '40%',
    fontStyle: 'italic',
  },
  skeletonVerse: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '100%',
  },
  skeletonVerseShort: {
    width: '85%',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C62828',
    marginBottom: 4,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
  },
});

