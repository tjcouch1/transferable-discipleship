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
    loop: false,
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
