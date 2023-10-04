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

import { ScriptureVerseRangeContent } from '../services/ScriptureService';
import { sup } from '../util/Util';
import { Text, TextDataObject } from './contents/Text';

export type ScriptureTextProps = {
  scriptureText: ScriptureVerseRangeContent;
} & Omit<TextDataObject, 'text'>;

export const ScriptureText = ({
  scriptureText,
  // Default design to small to overwrite default in Text
  design = 'small',
  ...textProps
}: ScriptureTextProps) => {
  // Put superscripted verse numbers and a non-breaking space before the verse
  // Trim the verse to remove extraneous new lines
  const text = scriptureText.verses
    .map(v => `${sup(v.verse.toString())}\xa0${v.text.trim()}`)
    .join(' ');

  return <Text {...textProps} text={text} design={design} />;
};
