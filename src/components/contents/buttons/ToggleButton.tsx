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
import { getTextDataObject } from '../Text';

/** The data that defines the ActionButton */
export interface ToggleButtonData extends ButtonDataBase {
  type: 'ToggleButton';
  altButtons?: Omit<ButtonDataBase, 'type'>[];
  loop?: boolean;
  /** When true, start showing altButtons[0] instead of the primary button text */
  revealedInitially?: boolean;
}

/** Props the ActionButton needs to function */
export interface ToggleButtonProps extends Omit<ToggleButtonData, 'type'> {}

const TAP_HINT = ' (Tap to reveal)';
const GO_BACK_HINT = ' (tap to go back)';

/** Button that toggles between different looks */
export const ToggleButton = (props: ToggleButtonProps) => {
  const { altButtons, loop, revealedInitially, ...buttonDataProps } = {
    altButtons: [],
    loop: true,
    revealedInitially: false,
    ...props,
  };

  /**
   * Keep track of which button looks we're on.
   * 0 = default button looks
   * Otherwise, it indexes altButtons offset by 1, so buttonIndex 1 is altButtons[0]
   */
  const [buttonIndex, setButtonIndex] = useState(
    revealedInitially && altButtons.length > 0 ? 1 : 0,
  );

  /** Cycle the button looks state */
  const onPress = () => {
    setButtonIndex(currentButtonIndex => {
      if (currentButtonIndex < 0) return 0;

      return loop
        ? (currentButtonIndex + 1) % (altButtons.length + 1)
        : Math.min(currentButtonIndex + 1, altButtons.length);
    });
  };

  const displayProps =
    buttonIndex === 0 ? buttonDataProps : altButtons[buttonIndex - 1];
  const textObj = getTextDataObject(displayProps.text);
  const rawText = textObj?.text ?? '';

  const altText =
    altButtons.length > 0
      ? getTextDataObject(altButtons[0].text)?.text ?? ''
      : '';
  const hasDifferentContent = rawText !== altText;

  const needsTapHint =
    buttonIndex === 0 &&
    altButtons.length > 0 &&
    hasDifferentContent &&
    !rawText.toLowerCase().includes('tap') &&
    !rawText.toLowerCase().includes('reveal');

  const revealedObj = getTextDataObject(displayProps.text);
  const revealedRaw = revealedObj?.text ?? '';
  const needsGoBackHint =
    buttonIndex > 0 &&
    altButtons.length > 0 &&
    !revealedRaw.toLowerCase().includes('tap to go back');

  let textWithHint = displayProps.text;
  if (needsTapHint) {
    textWithHint = { ...textObj, text: rawText + TAP_HINT };
  } else if (needsGoBackHint) {
    textWithHint = { ...revealedObj, text: revealedRaw + GO_BACK_HINT };
  }

  return (
    <BasicButton
      {...displayProps}
      text={textWithHint}
      onPress={onPress}
    />
  );
};
