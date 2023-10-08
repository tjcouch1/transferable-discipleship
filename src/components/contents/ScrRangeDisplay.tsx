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

import { useCallback } from 'react';
import usePromise from '../../hooks/usePromise';
import { getScripture } from '../../services/ScriptureService';
import { ScriptureText } from '../ScriptureText';
import { ContentDataBase } from './Contents';
import { Text, TextDataObject } from './Text';

export type ScrRangeDisplayContentData = ContentDataBase & {
  type: 'ScrRangeDisplay';
  reference: string;
} & Omit<TextDataObject, 'text'>;

/**
 * Data that defines ScrRangeDisplay but without the type
 * (useful when you want to use ScrRangeDisplay in another component)
 */
export type ScrRangeDisplayData = Omit<ScrRangeDisplayContentData, 'type'>;

/** Props the ScrRangeDisplay needs to function */
export interface ScrRangeDisplayProps extends ScrRangeDisplayData {}

export const ScrRangeDisplay = ({
  reference,
  ...textProps
}: ScrRangeDisplayProps) => {
  const [scriptureText] = usePromise(
    useCallback(() => getScripture(reference), []),
    undefined,
  );

  return scriptureText ? (
    <ScriptureText scriptureText={scriptureText} {...textProps} />
  ) : (
    <Text text={'loading'} {...textProps} />
  );
};
