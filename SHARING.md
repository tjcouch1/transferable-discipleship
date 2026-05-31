# Sharing Functionality

This document explains how to use the sharing functionality in the Transferable Discipleship app.

## Overview

The app now supports sharing screens and scripture references with deep links. Users can share content via the native share dialog (iOS/Android) or Web Share API (web browsers).

## Usage

### Sharing a Screen

To add a share button for a screen, use an `ActionButton` with a `share` action:

```json
{
  "type": "ActionButton",
  "text": "Share this screen",
  "action": {
    "type": "share",
    "shareType": "currentScreen",
    "title": "Optional custom title"
  }
}
```

To share a specific screen (not the current one):

```json
{
  "type": "ActionButton",
  "text": "Share Basics",
  "action": {
    "type": "share",
    "shareType": "screen",
    "target": "app:/basics",
    "title": "Basics"
  }
}
```

### Sharing Scripture

To share a scripture reference:

```json
{
  "type": "ActionButton",
  "text": "Share Scripture",
  "action": {
    "type": "share",
    "shareType": "scripture",
    "target": "John 3:16",
    "includeText": true
  }
}
```

- `includeText`: Set to `true` (default) to include the full scripture text, or `false` to share only the reference and link.

## Deep Links

### Screen Deep Links

Screen deep links follow the format:
- **Web**: `https://tjcouch1.github.io/transferable-discipleship/app/#/screen-path`
- **Native**: `transferable-discipleship://screen-path`

Example: `transferable-discipleship://basics/lesson-1`

### Scripture Deep Links

Scripture deep links follow the format:
- **Web**: `https://tjcouch1.github.io/transferable-discipleship/app/#/scripture/John%203:16`
- **Native**: `transferable-discipleship://scripture/John%203:16`

## Programmatic Usage

You can also use the ShareService directly in code:

```typescript
import { shareScreen, shareScripture } from './src/services/ShareService';

// Share current screen
await shareScreen('app:/basics', 'Basics');

// Share scripture
await shareScripture('John 3:16', true); // true = include text
```

## Implementation Details

- **Native (iOS/Android)**: Uses React Native's `Share` API
- **Web**: Uses Web Share API if available, falls back to copying to clipboard
- **Deep Links**: Automatically handled by the app's navigation system
- **Scripture Text**: Fetched from cache or API when sharing with text included

## Notes

- Deep links will open the app if installed, or the web version if not
- Scripture sharing with text requires the scripture to be cached or fetched
- Web sharing requires HTTPS (or localhost for development)

