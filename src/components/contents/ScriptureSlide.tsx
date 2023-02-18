import React, { useCallback } from 'react';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ButtonDataBase } from './buttons/Buttons';
import { ContentData, ContentDataBase } from './Contents';
import { ScrRangeDisplayContentData } from './ScrRangeDisplay';
import { Slide, SlideData } from './Slide';

export type ScriptureSlideContentData = ContentDataBase & {
  type: 'ScriptureSlide';
  reference: string;
  hiddenButton?: Omit<ButtonDataBase, 'type'>;
  revealedButton?: Omit<ButtonDataBase, 'type'>;
} & Omit<SlideData, 'contents'>;

const defaultHiddenButton: Omit<ButtonDataBase, 'type'> = {
    text: { text: 'Tap to reveal answer' },
    design: 'answer',
  }

const defaultRevealedButton: Omit<ButtonDataBase, 'type'> = {
  design: 'answer',
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
  hiddenButton,
  revealedButton,
  // Overwrite default padding from ContentList with 3
  padding = 3,
  ...slideProps
}: ScriptureSlideProps) => {
  const designStyle = designStyles[''];

  // Only show wa button if a button was provided to be shown
  const showButton = hiddenButton || revealedButton;
  // Ensure the buttonStates have enough information in them
  // TODO: Make a good merge function and merge these better so you can style the default text without losing the default text
  const hiddenButtonMerged = {
    ...defaultHiddenButton,
    ...hiddenButton,
  };
  const revealedButtonMerged = {
    ...defaultRevealedButton,
    ...revealedButton,
  };

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
  if (showButton)
    contents.push({
      type: 'ActionButton',
      design: 'answer',
      action: {
        type: 'toggle',
        altButtons: [revealedButtonMerged],
      },
      ...hiddenButtonMerged,
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
