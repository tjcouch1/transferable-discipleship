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
