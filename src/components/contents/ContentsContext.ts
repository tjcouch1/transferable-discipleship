import { createContext } from 'react';
import { PropsWithNavigation } from '../../util/ActionFactory';

// One day, wrap this in better context functions that do not expose the context and properly throw on using default value? Not particularly important in this case
/**
 * Context that provides a list of Content components that may be displayed.
 * Used to remove the dependency cycle between ContentsList.tsx and Contents.ts
 */
const ContentsContext = createContext<{
  [contentType: string]: (props: PropsWithNavigation<any>) => JSX.Element;
}>({});

export default ContentsContext;
