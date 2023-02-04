/**
 * Functions related to creating DesignStyleSheets
 */

import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

/** Internal type from react-native. Type used in StyleSheet.create. Enables intellisense on styles */
type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/** Style sheet for a specific design that extends other designs */
type DesignStyleSheet<D extends string, T> = Partial<NamedStyles<T>> & {
  /** Which designs to extend. Automatically includes base style. Can only list designs above the current design */
  // Used to be D[], but then TypeScript was defining D on this instead of on the DesignStyleSheetExtensions's object keys
  extends?: string[];
};

/** All designs for a style sheet design composition */
type DesignStyleSheetExtensions<D extends string, T> = {
  [name in D]: DesignStyleSheet<D, T>;
};

/** All designs for a component indexed by name */
type DesignStyleSheetComposition<T> = {
  [name: string]: T;
};

/**
 * Create a design style sheet composition from a base style and style extensions.
 * Gives you an object you can use to get a stylesheet customized for the design you input
 * @param baseStyles base set of styles to apply to any design
 * @param extensions named sets of styles to apply over the base to make a design (use extends to extend other designs too)
 * @returns object whose members consist of design style sheets at each design name. Any design not found will revert to baseStyles.
 */
export const createDesignStyleSheets = <D extends string, T extends NamedStyles<T>>(
  baseStyles: T,
  extensions: DesignStyleSheetExtensions<D, T>,
): DesignStyleSheetComposition<T> => {
  const baseStyleSheet = StyleSheet.create(baseStyles);

  const designStyleSheets: DesignStyleSheetComposition<T> = new Proxy(
    Object.fromEntries(
      Object.entries(extensions).map(([name, dSS]) => {
        // Not sure why TypeScript drops the type here on Object.entries() on extensions
        const designStyleSheet = dSS as DesignStyleSheet<D, T>;

        // Assemble an array of the style sheet objects for the sheets to extend
        const overlaySheets = designStyleSheet.extends
          ? [
              ...designStyleSheet.extends.map(
                extensionName => extensions[extensionName as D],
              ),
              designStyleSheet,
            ]
          : [designStyleSheet];

        // Reduce the sheets together, overwriting entries
        return [
          name,
          StyleSheet.create(
            // Lay each sheet over the previous ones
            overlaySheets.reduce(
              (overlayedSheet, currentSheet) =>
                Object.fromEntries(
                  // For each style in baseStyles, create a new style by combining its styles with the current design's styles
                  Object.keys(baseStyles).map(styleName => [
                    styleName as keyof T,
                    {
                      ...overlayedSheet[styleName as keyof T],
                      ...currentSheet[styleName as keyof T],
                    },
                  ]),
                ) as unknown as T,
              baseStyles,
            ),
          ),
        ];
      }),
    ),
    {
      get(obj, prop: string) {
        return prop in obj ? obj[prop] : baseStyleSheet;
      },
    },
  );

  return designStyleSheets;
};
