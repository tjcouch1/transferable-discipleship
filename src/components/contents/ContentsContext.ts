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

import { createContext } from 'react';

// One day, wrap this in better context functions that do not expose the context and properly throw on using default value? Not particularly important in this case
/**
 * Context that provides a list of Content components that may be displayed.
 * Used to remove the dependency cycle between ContentsList.tsx and Contents.ts
 */
const ContentsModuleContext = createContext<typeof import('./Contents')>(
  // @ts-expect-error ts(2345) This context shouldn't have anything in it until it's filled in App.tsx
  {},
);

export default ContentsModuleContext;
