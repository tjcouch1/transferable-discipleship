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

import React, { useState } from 'react';
import { BasicButton } from './BasicButton';
import { ButtonDataBase } from './Buttons';

/** The data that defines the ActionButton */
export interface ToggleButtonData extends ButtonDataBase {
  type: 'ToggleButton';
  altButtons?: Omit<ButtonDataBase, 'type'>[];
  loop?: boolean;
}

/** Props the ActionButton needs to function */
export interface ToggleButtonProps extends Omit<ToggleButtonData, 'type'> {}

/** Button that toggles between different looks */
export const ToggleButton = (props: ToggleButtonProps) => {
  const { altButtons, loop, ...buttonDataProps } = {
    altButtons: [],
    loop: true,
    ...props,
  };

  /**
   * Keep track of which button looks we're on.
   * 0 = default button looks
   * Otherwise, it indexes altButtons offset by 1, so buttonIndex 1 is altButtons[0]
   */
  const [buttonIndex, setButtonIndex] = useState(0);

  /** Cycle the button looks state */
  const onPress = () => {
    setButtonIndex(currentButtonIndex => {
      if (currentButtonIndex < 0) return 0;

      return loop
        ? (currentButtonIndex + 1) % (altButtons.length + 1)
        : Math.min(currentButtonIndex + 1, altButtons.length);
    });
  };

  return (
    <BasicButton
      {...(buttonIndex === 0 ? buttonDataProps : altButtons[buttonIndex - 1])}
      onPress={onPress}
    />
  );
};
