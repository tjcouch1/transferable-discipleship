import React from 'react';
import { Text, TextDataObject, getTextDataObject } from './Text';

/** Simple defining data for displaying header text */
type HeaderTextContentDataObject = Omit<TextDataObject, 'design'> & {
  type: 'HeaderText';
};

/** Defining data for displaying header text, either an object describing the text or just a string */
export type HeaderTextContentData = HeaderTextContentDataObject | string;

/** Data that defines HeaderText but without the type */
export type HeaderTextDataObject = Omit<HeaderTextContentDataObject, 'type'>;

/**
 * Data that defines HeaderText but without the type.
 * Either an object describing the text or just a string.
 * (useful when you want to use HeaderText in another component)
 */
export type HeaderTextData = HeaderTextDataObject | string;

/** Props the HeaderText needs to function */
export type HeaderTextProps = HeaderTextData;

export const HeaderText = (textData: HeaderTextData) => {
  const textDataObject = getTextDataObject(textData);
  return (
    <Text {...textDataObject} design="header" style={[textDataObject.style]} />
  );
};
