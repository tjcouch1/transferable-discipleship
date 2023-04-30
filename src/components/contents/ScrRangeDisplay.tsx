import { useCallback } from 'react';
import usePromise from '../../hooks/usePromise';
import { getScripture } from '../../services/ScriptureService';
import { ScriptureText } from '../ScriptureText';
import { ContentDataBase } from './Contents';
import { Text, TextData } from './Text';

export type ScrRangeDisplayContentData = ContentDataBase & {
  type: 'ScrRangeDisplay';
  reference: string;
} & Omit<TextData, 'text'>;

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
