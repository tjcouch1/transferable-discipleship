import React, { useCallback } from 'react';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ButtonDataBase } from './buttons/Buttons';
import { ContentData, ContentDataBase } from './Contents';
import { ScrRangeDisplayContentData } from './ScrRangeDisplay';
import { Slide, SlideData } from './Slide';

export type ScriptureSlideContentData = ContentDataBase & {
  type: 'ScriptureSlide';
  reference: string;
  buttonStates?: ScriptureSlideButton;
} & Omit<SlideData, 'contents'>;

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
 * Data that defines ScriptureSlide but without the type
 * (useful when you want to use ScriptureSlide in another component)
 */
export type ScriptureSlideData = Omit<ScriptureSlideContentData, 'type'>;

/** Props the ScriptureSlide needs to function */
export interface ScriptureSlideProps extends ScriptureSlideData {}

export const ScriptureSlide = ({
  headerText,
  reference,
  buttonStates,
  // Overwrite default padding from ContentList with 3
  padding = 3,
  ...slideProps
}: ScriptureSlideProps) => {
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
      type: 'ScrRangeDisplay',
      reference,
    } as ScrRangeDisplayContentData,
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
      padding={padding}
      {...slideProps}
    />
  );
};

const designStyles = createDesignStyleSheets({}, {});
