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

import { getAppScreens } from './ScreenService';
import { PATH_DELIMITER, pathJoin } from '../util/PathUtil';

/** The screen path one position before (-1) or after (+1) this one among its siblings */
export function getSiblingScreenPath(
  screenPath: string,
  offset: -1 | 1,
): string | undefined {
  const segments = screenPath.split(PATH_DELIMITER);
  if (segments.length < 2) return undefined;

  const parentPath = segments.slice(0, -1).join(PATH_DELIMITER);
  const parent = getAppScreens().screens.get(parentPath);
  if (!parent?.subscreens) return undefined;

  // Screen map subscreen entries keep their original (short) ids
  const currentId = segments[segments.length - 1];
  const index = parent.subscreens.findIndex(sub => sub.id === currentId);
  if (index < 0) return undefined;

  const sibling = parent.subscreens[index + offset];
  return sibling ? pathJoin(parentPath, sibling.id) : undefined;
}
