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

import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Layout } from '../../Theme';
// import type: avoids a runtime circular import (Contents.ts imports this file)
import type { ContentDataBase } from './Contents';
import { Text, TextData, getTextDataObject } from './Text';

/**
 * A reader prompt or discussion question displayed in the emphasized "answer"
 * style WITHOUT button semantics. Use this instead of a button when there is
 * nothing to tap (see CLAUDE.md content conventions).
 */
export type QuestionPromptContentData = ContentDataBase & {
  type: 'QuestionPrompt';
  text: TextData;
  style?: StyleProp<ViewStyle>;
};

/** Props the QuestionPrompt needs to function */
export interface QuestionPromptProps extends Omit<
  QuestionPromptContentData,
  'type'
> {}

export const QuestionPrompt = ({ text, style }: QuestionPromptProps) => {
  const { theme } = useTheme();
  const textObject = getTextDataObject(text);
  return (
    <View
      style={[
        {
          backgroundColor: theme.slide.background,
          padding: 15,
          borderLeftWidth: Layout.slideBorderWidth,
          borderLeftColor: theme.button.backgroundAnswer,
          borderRadius: 0,
          width: 'auto',
          maxWidth: Layout.maxContentWidth,
        },
        style,
      ]}>
      <Text
        {...textObject}
        style={[
          { color: theme.text.lineText, fontSize: 17, fontStyle: 'italic' },
          textObject.style,
        ]}
      />
    </View>
  );
};
