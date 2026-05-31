/**
 * Enhanced ScrRangeDisplay Example
 * 
 * This file shows how ScrRangeDisplay could be updated to use enhanced loading states.
 * To use this, replace the current ScrRangeDisplay.tsx with this implementation.
 */

import { useCallback } from 'react';
import usePromise from '../../hooks/usePromise';
import { getScripture } from '../../services/ScriptureService';
import { ScriptureText } from '../ScriptureText';
import { ContentDataBase } from './Contents';
import { TextDataObject } from './Text';
import { ScriptureSkeletonLoader, LoadingWithError } from './EnhancedLoadingExample';

export type ScrRangeDisplayContentData = ContentDataBase & {
  type: 'ScrRangeDisplay';
  reference: string;
} & Omit<TextDataObject, 'text'>;

export type ScrRangeDisplayData = Omit<ScrRangeDisplayContentData, 'type'>;

export interface ScrRangeDisplayProps extends ScrRangeDisplayData {}

export const ScrRangeDisplay = ({
  reference,
  ...textProps
}: ScrRangeDisplayProps) => {
  const [scriptureText, isLoading] = usePromise(
    useCallback(async () => {
      try {
        return await getScripture(reference);
      } catch (error) {
        // Return error so LoadingWithError can handle it
        throw error;
      }
    }, [reference]),
    undefined,
  );

  // Enhanced version with skeleton loader and error handling
  return (
    <LoadingWithError
      isLoading={isLoading}
      error={scriptureText === undefined && !isLoading ? new Error('Failed to load scripture') : null}
    >
      {scriptureText ? (
        <ScriptureText scriptureText={scriptureText} {...textProps} />
      ) : (
        <ScriptureSkeletonLoader />
      )}
    </LoadingWithError>
  );
};

/* 
 * Alternative simpler version - just replace the loading text with skeleton:
 * 
 * return scriptureText ? (
 *   <ScriptureText scriptureText={scriptureText} {...textProps} />
 * ) : (
 *   <ScriptureSkeletonLoader />
 * );
 */

