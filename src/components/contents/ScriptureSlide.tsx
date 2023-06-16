import React from 'react';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ButtonDataBase } from './buttons/Buttons';
import { ContentData, ContentDataBase } from './Contents';
import { ScrRangeDisplayContentData } from './ScrRangeDisplay';
import { Slide, SlideData } from './Slide';
import { getTextDataObject } from './Text';

type SlideScripture = {
  reference: string;
  hiddenButton?: Omit<ButtonDataBase, 'type'>;
  revealedButton?: Omit<ButtonDataBase, 'type'>;
};

export type ScriptureSlideContentData = ContentDataBase & {
  type: 'ScriptureSlide';
  scripture: SlideScripture | [SlideScripture, ...SlideScripture[]];
} & Omit<SlideData, 'contents'>;

const defaultHiddenButton: Omit<ButtonDataBase, 'type'> = {
  text: { text: 'Tap to reveal answer' },
  design: 'answer',
};

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
  scripture,
  // Overwrite default padding from ContentList with 3
  padding = 3,
  ...slideProps
}: ScriptureSlideProps) => {
  const designStyle = designStyles[''];

  const contents: ContentData[] = [];

  const scriptures = Array.isArray(scripture) ? scripture : [scripture];

  scriptures.forEach((scr, i) => {
    // We will show the first reference as header if there isn't a header, so only make this subheader if there is header text
    if (i !== 0 || headerText)
      contents.push({
        type: 'Text',
        design: 'subheader',
        style: designStyle.subheader,
        text: scr.reference,
      });

    // Only show a button if a button was provided to be shown
    const showButton = scr.hiddenButton || scr.revealedButton;
    // Ensure the buttonStates have enough information in them
    // TODO: Make a good merge function and merge these better so you can style the default text without losing the default text
    const hiddenButtonMerged = {
      ...defaultHiddenButton,
      ...scr.hiddenButton,
    };
    const revealedButtonMerged = {
      ...defaultRevealedButton,
      ...scr.revealedButton,
    };

    contents.push({
      type: 'ScrRangeDisplay',
      reference: scr.reference,
    } as ScrRangeDisplayContentData);

    if (showButton)
      contents.push({
        type: 'ToggleButton',
        design: 'answer',
        // Default button is hidden button
        ...hiddenButtonMerged,
        // Can toggle to revealed button
        altButtons: [revealedButtonMerged],
      });
  });

  return (
    <Slide
      headerText={
        headerText
          ? { style: {}, ...getTextDataObject(headerText) }
          : { text: scriptures[0].reference }
      }
      contents={contents}
      padding={padding}
      {...slideProps}
    />
  );
};

const designStyles = createDesignStyleSheets({
  subheader: {
    fontSize: 18,
    textAlign: 'left',
    width: '100%',
  }
}, {});
