import React, { useCallback } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import usePromise from '../../hooks/usePromise';
import { getScripture } from '../../services/ScriptureService';
import Theme from '../../Theme';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentList } from './ContentList';
import { ContentData, ContentDataBase } from './Contents';
import { HeaderText, HeaderTextData } from './HeaderText';
import { Slide } from './Slide';
import { SubheaderText, SubheaderTextData } from './SubheaderText';
import { Text, TextData } from './Text';

export interface ScriptureSlideContentData extends ContentDataBase {
  type: 'ScriptureSlide';
  headerText?: HeaderTextData;
  contents: ContentData[];
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
  contents = [],
  style,
}: ScriptureSlideProps) => {
  const [scriptureText] = usePromise(
    useCallback(() => getScripture('Romans 12:1-2'), []),
    undefined,
  );
  const designStyle = designStyles[''];
  return (
    <Slide
      headerText={'Romans 12:1-2'}
      contents={[
        {
          type: 'Text',
          text: scriptureText
            ? JSON.stringify(scriptureText.verses.map(v => v.text).join(' '))
            : 'loading',
        },
      ]}
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
