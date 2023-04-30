import React from 'react';
import { Text, TextDataObject, getTextDataObject } from './Text';

/** Simple defining data for displaying subheader text */
type SubheaderTextContentDataObject = Omit<TextDataObject, 'design'> & {
  type: 'HeaderText';
};

/** Defining data for displaying subheader text, either an object describing the text or just a string */
export type SubheaderTextContentData = SubheaderTextContentDataObject | string;

/** Data that defines HeaderText but without the type */
export type SubheaderTextDataObject = Omit<SubheaderTextContentDataObject, 'type'>;

/**
 * Data that defines HeaderText but without the type.
 * Either an object describing the text or just a string.
 * (useful when you want to use HeaderText in another component)
 */
export type SubheaderTextData = SubheaderTextDataObject | string;

/** Props the HeaderText needs to function */
export type SubheaderTextProps = SubheaderTextData;

export const SubheaderText = (textData: SubheaderTextData) => {
  const textDataObject = getTextDataObject(textData);
  return (
    <Text
      {...textDataObject}
      design="subheader"
      style={[textDataObject.style]}
    />
  );
};
