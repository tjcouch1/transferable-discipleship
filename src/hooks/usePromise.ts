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

import { useEffect, useState } from 'react';

// From https://github.com/tjcouch-sil/paranext-poc/blob/main/react-electron-poc/src/renderer/hooks/usePromise.ts

/** Awaits a promise and returns a loading value while the promise is unresolved
 * @param promiseFactoryCallback a function that returns the promise to await. If the promise resolves to null, the value will not change.
 *      WARNING: MUST BE WRAPPED IN A useCallback. The reference must not be updated every render
 * @param defaultValue the initial value to return while first awaiting the promise. If preserveValue is false, this value is also shown while awaiting the promise on subsequent calls.
 *      WARNING: MUST BE WRAPPED IN A useState, useMemo, etc. The reference must not be updated every render
 * @param preserveValue whether to leave the value as the most recent resolved promise value or set it back to defaultValue while running the promise again. Default to true
 * @returns [value, isLoading] the current value for the promise, either the defaultValue or the resolved promise value; whether the promise is waiting to be resolved
 */
export default <T>(
  promiseFactoryCallback: () => Promise<T | null>,
  defaultValue: T,
  preserveValue = true,
): [value: T, isLoading: boolean] => {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    let promiseIsCurrent = true;
    setLoading(true);
    (async () => {
      const result = await promiseFactoryCallback();
      if (promiseIsCurrent) {
        // If the promise returned null, it purposely did this to do nothing. Maybe its dependencies are not set up
        if (result != null) setValue(result);
        setLoading(false);
      }
    })();

    return () => {
      // Mark this promise as old and not to be used
      promiseIsCurrent = false;
      if (!preserveValue) setValue(defaultValue);
    };
  }, [promiseFactoryCallback, defaultValue, preserveValue]);

  return [value, loading];
};
