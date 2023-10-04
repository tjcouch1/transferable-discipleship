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
import { Text, TextDataObject, TextPropsBase, getTextDataObject } from './Text';

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
export type HeaderTextProps = HeaderTextData & TextPropsBase;

export const HeaderText = (props: HeaderTextProps) => {
  const textDataObject = getTextDataObject(props);
  return (
    <Text {...textDataObject} design="header" style={[textDataObject.style]} />
  );
};
