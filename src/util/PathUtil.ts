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

/**
 * Handles path manipulation
 */

export const PATH_DELIMITER = '/';

export const ROOT_PATH = 'app:';

export function pathJoin(...paths: string[]): string {
  // Don't want empty strings to do anything
  const pathsClean = paths.filter(path => path);

  if (pathsClean.length === 0) return '';
  if (pathsClean[0] === '..')
    throw new Error(
      'Cannot go back .. as the first path as there is nowhere back to go',
    );

  const pathSegments = pathsClean
    // separate the paths out along the delimiter
    .flatMap(path => path.split(PATH_DELIMITER))
    // remove empty strings
    .filter(path => path);

  for (let i = pathSegments.length - 1; i > 0; i--) {
    // If there is a .., remove the .. and the directory before it
    if (pathSegments[i] === '..') {
      pathSegments.splice(i - 1, 2);
      i--;
    }
    // If we find ROOT_PATH, use that and forward and nothing before it (start path over at root)
    else if (pathSegments[i] === ROOT_PATH) {
      pathSegments.splice(0, i);
      break;
    }
  }

  // Get the first path so we can use it without putting a delimiter before it
  const [basePath, ...remainingPaths] = pathSegments;

  return remainingPaths.reduce((joinedPath, currentPath) => {
    return `${joinedPath}${PATH_DELIMITER}${currentPath}`;
  }, basePath);
}
