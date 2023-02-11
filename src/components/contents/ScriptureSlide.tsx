import React, { useCallback } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import usePromise from '../../hooks/usePromise';
import { getScripture } from '../../services/ScriptureService';
import Theme from '../../Theme';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentData, ContentDataBase } from './Contents';
import { HeaderTextData } from './HeaderText';
import { Slide } from './Slide';

export interface ScriptureSlideContentData extends ContentDataBase {
  type: 'ScriptureSlide';
  headerText?: HeaderTextData;
  reference: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Data that defines Slide but without the type
 * (useful when you want to use Slide in another component)
 */
export type ScriptureSlideData = Omit<ScriptureSlideContentData, 'type'>;

/** Props the Slide needs to function */
export interface ScriptureSlideProps extends ScriptureSlideData {}

export const ScriptureSlide = ({
  headerText,
  reference,
  style,
}: ScriptureSlideProps) => {
  const [scriptureText] = usePromise(
    useCallback(() => getScripture(reference), []),
    undefined,
  );
  const designStyle = designStyles[''];
  return (
    <Slide
      headerText={
        headerText ? { style: {}, ...headerText } : { text: reference }
      }
      contents={(headerText
        ? [
            {
              type: 'Text',
              design: 'subheader',
              text: reference,
            } as ContentData,
          ]
        : []
      ).concat([
        {
          type: 'Text',
          text: scriptureText
            ? JSON.stringify(
                scriptureText.verses
                  .map(v => `${v.verse} ${v.text}`)
                  .join(' ')
                  .replace(/\n/g, ' '),
              )
            : 'loading',
        },
      ])}
      design={'no-padding'}
    />
  );
};

const designStyles = createDesignStyleSheets(
  {
    headerView: {
      paddingVertical: 10,
      backgroundColor: Theme.default.backgroundColor,
      paddingHorizontal: 15,
      width: '90%',
      borderBottomWidth: 10,
      borderBottomColor: Theme.dimmed.backgroundColor,
    },
    headerText: {
      fontSize: 25,
      fontWeight: '600',
    },
  },
  {},
);
