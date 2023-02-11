import React, { useCallback } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import usePromise from '../../hooks/usePromise';
import { getScripture } from '../../services/ScriptureService';
import Theme from '../../Theme';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ButtonDataBase } from './buttons/Buttons';
import { ContentData, ContentDataBase } from './Contents';
import { HeaderTextData } from './HeaderText';
import { Slide } from './Slide';
import { TextContentData } from './Text';

export interface ScriptureSlideContentData extends ContentDataBase {
  type: 'ScriptureSlide';
  headerText?: HeaderTextData;
  reference: string;
  buttonStates?: ScriptureSlideButton;
  style?: StyleProp<ViewStyle>;
}

type ScriptureSlideButton = {
  hidden?: Omit<ButtonDataBase, 'type'>;
  revealed: Omit<ButtonDataBase, 'type'>;
};

const defaultButtonStates: Partial<ScriptureSlideButton> = {
  hidden: {
    text: { text: 'Tap to reveal answer' },
    design: 'answer',
  },
  revealed: {
    design: 'answer',
  },
};

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
  buttonStates,
  style,
}: ScriptureSlideProps) => {
  const [scriptureText] = usePromise(
    useCallback(() => getScripture(reference), []),
    undefined,
  );
  const designStyle = designStyles[''];

  /** Ensure the buttonStates have enough information in them  */
  const buttonToggleStates = buttonStates
    ? {
        // TODO: Make a good merge function and merge these better so you can style the default text without losing the default text
        hidden: { ...defaultButtonStates.hidden, ...buttonStates.hidden },
        revealed: { ...defaultButtonStates.revealed, ...buttonStates.revealed },
      }
    : undefined;

  const contents: ContentData[] = [
    {
      type: 'Text',
      design: 'small',
      text: scriptureText
        ? JSON.stringify(
            scriptureText.verses
              .map(v => `${v.verse} ${v.text}`)
              .join(' ')
              .replace(/\n/g, ' '),
          )
        : 'loading',
    } as TextContentData,
  ];
  if (headerText)
    contents.unshift({
      type: 'Text',
      design: 'subheader',
      text: reference,
    });
  if (buttonToggleStates)
    contents.push({
      type: 'ActionButton',
      design: 'answer',
      action: {
        type: 'toggle',
        altButtons: [buttonToggleStates.revealed],
      },
      ...buttonToggleStates.hidden,
    });

  return (
    <Slide
      headerText={
        headerText ? { style: {}, ...headerText } : { text: reference }
      }
      contents={contents}
      padding={3}
    />
  );
};

const designStyles = createDesignStyleSheets({}, {});
