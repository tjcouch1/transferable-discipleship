# Bookmarks and Progress Tracking

This document explains the new bookmarking and reading progress tracking features.

## Features Implemented

### 1. Bookmarks (Feature #12)
Users can bookmark favorite screens for quick access.

**Services:**
- `src/services/BookmarkService.ts` - Handles bookmark persistence
- `src/contexts/BookmarksContext.tsx` - React context for bookmark state

**Actions:**
- New `bookmark` action type in `ActionFactory.ts`
- Use `{ "type": "bookmark", "screenPath": "optional/path" }` in ActionButton configs

**Example usage in screens.json:**
```json
{
  "type": "ActionButton",
  "text": "Bookmark this screen",
  "action": {
    "type": "bookmark"
  }
}
```

### 2. Reading Progress Tracking (Feature #13)
Tracks which screens users have visited, with timestamps and visit counts.

**Services:**
- `src/services/ProgressService.ts` - Handles progress persistence
- `src/contexts/ProgressContext.tsx` - React context for progress state

**Visual Indicators:**
- ActionButtons now show a green checkmark (✓) indicator for visited screens
- Progress is automatically tracked when navigating to screens
- Progress persists across app sessions

**What's Tracked:**
- First visit timestamp
- Last visit timestamp  
- Visit count

### 3. Enhanced Loading States (Feature #6 - Example)
Example components showing improved loading states.

**File:**
- `src/components/contents/EnhancedLoadingExample.tsx` - Example loading components

**Components:**
1. `LoadingIndicator` - Activity indicator with text
2. `SkeletonLoader` - Animated skeleton placeholders
3. `ScriptureSkeletonLoader` - Scripture-specific skeleton
4. `LoadingWithError` - Handles loading and error states

**Example usage:**
See `src/components/contents/ScrRangeDisplay.enhanced.example.tsx` for how to integrate enhanced loading into ScrRangeDisplay.

## Implementation Details

### Providers Setup
The app now includes three new providers in `App.tsx`:
1. `VisitedScreensProvider` - Existing, tracks session visits
2. `ProgressProvider` - NEW, tracks persistent progress
3. `BookmarksProvider` - NEW, manages bookmark state

### Data Persistence
- Bookmarks stored in `bookmarks/screens.{version}.json`
- Progress stored in `progress/screens.{version}.json`
- Uses `StorageService` for cross-platform persistence (localStorage on web, FileSystem on native)

### Bookmarks Screen
A new `BookmarksScreen` component is available (not yet added to navigation). To add it:
1. Add to `src/components/screens/Screens.tsx`:
```typescript
import { BookmarksScreen } from './BookmarksScreen';

export const Screens = {
  // ... existing screens
  BookmarksScreen,
};
```

2. Add a navigation button in screens.json:
```json
{
  "type": "ActionButton",
  "text": "My Bookmarks",
  "action": {
    "type": "navigate",
    "to": "Bookmarks"
  }
}
```

## Future Enhancements

- Add bookmark icon button to screen headers
- Progress percentage indicators
- Reading streaks/tracking
- Export/import bookmarks
- Bookmark folders/categories

