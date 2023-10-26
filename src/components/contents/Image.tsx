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

import { ImageStyle, StyleProp, TouchableWithoutFeedback } from 'react-native';
import { ContentDataBase } from './Contents';
import { Image as ReactImage } from 'react-native';
import {
  ImageUrl,
  getImageSource,
  isRemote,
} from '../../services/ImageService';
import { isWeb } from '../../util/Util';
import { useState } from 'react';
// Thanks to Yahia Naguib at https://stackoverflow.com/a/61130824 for sharing how to get babel to include this package
import ImageView from 'better-react-native-image-viewing';
import { openURL } from 'expo-linking';

/** Simple defining data for displaying images */
export interface ImageContentData extends ContentDataBase {
  type: 'Image';
  image: ImageUrl;
  attribution?: string;
  style?: StyleProp<ImageStyle>;
}

/**
 * Data that defines Image but without the type
 * (useful for when you want to use Image in another component)
 */
export type ImageData = Omit<ImageContentData, 'type'>;

/** Props the Image needs to function */
export interface ImageProps extends ImageData {}

export function Image({ image: source, style }: ImageProps) {
  const [isModal, setIsModal] = useState(false);

  const defaultSize = 75 * (isWeb() && isModal ? 3 : 1);

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() =>
          isWeb()
            ? window.open(getImageSource(source).toString(), '_blank')
            : setIsModal(!isModal)
        }>
        <ReactImage
          source={getImageSource(source)}
          aria-label={source}
          style={[
            isWeb() || isRemote(source)
              ? { width: defaultSize, height: defaultSize }
              : {},
            style,
          ]}
        />
      </TouchableWithoutFeedback>
      {!isWeb() && isModal && (
        <ImageView
          images={[getImageSource(source)]}
          imageIndex={0}
          visible={isModal}
          onRequestClose={() => setIsModal(false)}
          animationType="slide"
          swipeToCloseEnabled
        />
      )}
    </>
  );
}
