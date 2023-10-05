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
import { StyleSheet } from 'react-native';
import { ActionButton, ActionButtonData } from './buttons/ActionButton';
import { ContentDataBase } from './Contents';
import { getTextDataObject } from './Text';

/** The data that defines the ButtonList */
export interface ButtonListContentData extends ContentDataBase {
  type: 'ButtonList';
  buttons: ActionButtonData[];
}

/**
 * Data that defines ButtonList but without the type
 * (useful when you want to use ButtonList in another component)
 */
export type ButtonListData = Omit<ButtonListContentData, 'type'>;

/** Props the ButtonList needs to function */
export interface ButtonListProps extends ButtonListData {}

export const ButtonList = ({ buttons }: ButtonListProps) => {
  return (
    <>
      {buttons.map((button, i) => (
        <ActionButton
          key={button.text ? getTextDataObject(button.text).text || i : i}
          {...button}
          style={[styles.button, button.style]}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 45,
  },
});
