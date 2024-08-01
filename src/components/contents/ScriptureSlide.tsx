/**
 * Copyright (C) 2023 TJ Couch
 * This file is part of discipleship‑app‑template.
 *
 * discipleship‑app‑template is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * discipleship‑app‑template is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with discipleship‑app‑template. If not, see <http://www.gnu.org/licenses/>.
 */

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
        style: [designStyle.subheader, designStyle.contents],
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
      style: designStyle.contents,
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

const designStyles = createDesignStyleSheets(
  {
    subheader: {
      fontSize: 18,
      fontWeight: '700',
    },
    contents: {
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
  },
  {},
);
