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

import React, { useMemo } from 'react';
import { StyleSheet, ViewStyle, View, Text } from 'react-native';
import { BasicButton } from './BasicButton';
import { ActionData, ActionFactory } from '../../../util/ActionFactory';
import { ButtonDataBase } from './Buttons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextData, getTextDataObject } from '../Text';
import { useVisitedScreens } from '../../../contexts/VisitedScreensContext';
import { useProgress } from '../../../contexts/ProgressContext';
import { pathJoin } from '../../../util/PathUtil';

/** The data that defines the ActionButton */
export interface ActionButtonData extends ButtonDataBase {
  type: 'ActionButton';
  action?: ActionData;
}

/** Props the ActionButton needs to function */
export interface ActionButtonProps extends Omit<ActionButtonData, 'type'> { }

/** Button that performs an action when clicked */
export const ActionButton = (props: ActionButtonProps) => {
  const { action, ...buttonData } = props;
  const navigation = useNavigation();
  const route = useRoute();
  const { isScreenVisited } = useVisitedScreens();
  const { getScreenProgress, getCompletionPercentage, progress } = useProgress();
  const [completionPercentage, setCompletionPercentage] = React.useState<number | null>(null);

  // Set up text style with underline for `link` action type
  const textObject = useMemo<TextData | undefined>(() => {
    if (!action || action.type !== 'link' || !buttonData.text)
      return buttonData.text;

    const buttonTextObject = getTextDataObject(buttonData.text);
    return {
      text: buttonTextObject.text,
      style: {
        textDecorationLine: 'underline',
        // StyleProp won't spread, so I'm just going to assert this
        ...(buttonTextObject.style as object),
      },
    };
  }, []);

  // Check if this is a navigate action and if the target screen has been visited
  const targetScreenPath = useMemo(() => {
    if (action?.type === 'navigate' && action.to) {
      return pathJoin(route.name, action.to);
    }
    return null;
  }, [action, route.name]);

  const isVisited = targetScreenPath ? isScreenVisited(targetScreenPath) : false;
  const isHomeScreen = route.name === 'Home';

  // Get button text to check if it's one of the main navigation buttons
  const buttonText = useMemo(() => {
    const textObj = getTextDataObject(buttonData.text);
    return textObj?.text || '';
  }, [buttonData.text]);

  // List of main navigation buttons that should never turn gray
  const mainNavigationButtons = [
    'Start Here',
    'Basics',
    'About',
  ];

  const isMainNavigationButton = mainNavigationButtons.includes(buttonText);

  // Get progress for the target screen
  const screenProgress = useMemo(() => {
    return targetScreenPath ? getScreenProgress(targetScreenPath) : null;
  }, [targetScreenPath, getScreenProgress]);

  // Check if screen is completed (all content/subscreens have been visited)
  const isCompleted = screenProgress?.completed ?? false;

  // Load completion percentage when target screen path or progress changes
  React.useEffect(() => {
    if (targetScreenPath && !isHomeScreen) {
      getCompletionPercentage(targetScreenPath).then(setCompletionPercentage).catch(() => {
        setCompletionPercentage(null);
      });
    } else {
      setCompletionPercentage(null);
    }
  }, [targetScreenPath, isHomeScreen, getCompletionPercentage, progress]);

  // Apply gray styling if visited, but not on the home screen or main navigation buttons
  const visitedStyle = useMemo<ViewStyle | undefined>(() => {
    if (isVisited && !isHomeScreen && !isMainNavigationButton) {
      return {
        backgroundColor: '#d3d3d3', // Light gray
        opacity: 0.7,
      };
    }
    return undefined;
  }, [isVisited, isHomeScreen, isMainNavigationButton]);

  // Show progress indicator if:
  // - Screen has been visited (shows percentage if incomplete, checkmark if complete)
  // - Not on home screen
  // - Has a target screen path
  // - Has a valid completion percentage (> 0) or is completed
  const showProgressIndicator = isVisited && !isHomeScreen && targetScreenPath && (isCompleted || (completionPercentage !== null && completionPercentage > 0));

  let onPress = action
    ? ActionFactory[action.type]({ ...action, navigation, route })
    : undefined;

  return (
    <View style={styles.container}>
      <BasicButton
        {...buttonData}
        text={textObject}
        onPress={onPress}
        style={[buttonData.style, visitedStyle]}
      />
      {showProgressIndicator && (
        <View style={styles.progressIndicator}>
          {isCompleted ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : (
            <Text style={styles.percentage}>{completionPercentage ?? 0}%</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  progressIndicator: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    minWidth: 36,
    height: 24,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  percentage: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
