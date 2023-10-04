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

import { StyleProp, ViewStyle } from 'react-native';
import { PropsWithNavigation } from '../../../util/ActionFactory';
import { TextData } from '../Text';
import { ActionButton, ActionButtonData } from './ActionButton';
import { BasicButton, BasicButtonData } from './BasicButton';
import { ToggleButton, ToggleButtonData } from './ToggleButton';

//----- BUTTON TYPES -----//

export const Buttons: {
  [contentType: string]: (props: PropsWithNavigation<any>) => JSX.Element;
} = {
  ActionButton,
  BasicButton,
  ToggleButton,
};

/** Defining data for every button type. All button types should extend ButtonDataBase */
export type ButtonData = ActionButtonData | BasicButtonData | ToggleButtonData;

/** All button types available */
export type ButtonType = keyof typeof Buttons;

/** The base data that every button must have. All button data types should extend ButtonDataBase */
export type ButtonDataBase = {
  type: ButtonType;
  design?: ButtonDesign;
  style?: StyleProp<ViewStyle>;
  text?: TextData;
};

type ButtonDesign = 'normal' | 'answer';
