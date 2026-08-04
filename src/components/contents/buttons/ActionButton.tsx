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
import { Text as ReactText, View } from 'react-native';
import { BasicButton } from './BasicButton';
import { ActionData, ActionFactory } from '../../../util/ActionFactory';
import { ButtonDataBase } from './Buttons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProgress } from '../../../contexts/ProgressContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { getAppScreens } from '../../../services/ScreenService';
import { pathJoin } from '../../../util/PathUtil';
import { TextData, getTextDataObject } from '../Text';

/** The data that defines the ActionButton */
export interface ActionButtonData extends ButtonDataBase {
  type: 'ActionButton';
  action?: ActionData;
}

/** Props the ActionButton needs to function */
export interface ActionButtonProps extends Omit<ActionButtonData, 'type'> {}

/** Button that performs an action when clicked */
export const ActionButton = (props: ActionButtonProps) => {
  const { action, ...buttonData } = props;
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { isVisited, completion, resetProgress } = useProgress();

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

  // Where a navigate action leads, if it leads to a real screen
  const targetPath = useMemo(() => {
    if (action?.type !== 'navigate') return undefined;
    const path = pathJoin(route.name, action.to);
    return getAppScreens().screens.has(path) ? path : undefined;
  }, [action, route.name]);

  // resetProgress is threaded into the action bag so resetVisited stays in the
  // factory. Visit tracking happens on screen focus (see useMarkVisitedOnFocus),
  // not on press, so navigate needs no wrapping here.
  const onPress = action
    ? ActionFactory[action.type]({ ...action, navigation, route, resetProgress })
    : undefined;

  // Visited indicators
  const showProgress = !!targetPath;
  const visited = showProgress ? isVisited(targetPath) : false;
  const completionPercent = showProgress ? completion(targetPath) : undefined;
  const badge =
    completionPercent !== undefined
      ? completionPercent >= 100
        ? '✓'
        : completionPercent > 0
          ? `${completionPercent}%`
          : undefined
      : visited
        ? '✓'
        : undefined;

  const badgeElement = badge ? (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
      <View
        style={{
          backgroundColor: theme.button.visitedBadge,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 4,
          minWidth: 32,
          alignItems: 'center',
        }}>
        <ReactText
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 14,
          }}>
          {badge}
        </ReactText>
      </View>
    </View>
  ) : undefined;

  return (
    <BasicButton
      {...buttonData}
      text={textObject}
      // Visited targets gray out (TouchableOpacity owns `opacity`, so use color)
      style={[
        visited && { backgroundColor: theme.slide.bottom },
        buttonData.style,
      ]}
      onPress={onPress}
      badge={badgeElement}
    />
  );
};
