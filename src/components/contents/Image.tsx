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

  const defaultSize = 75 * (isWeb() && isModal ? 3 : 1)

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setIsModal(!isModal)}>
        <ReactImage
          source={getImageSource(source)}
          style={[
            isWeb() || isRemote(source) ? { width: defaultSize, height: defaultSize } : {},
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
          animationType='slide'
          swipeToCloseEnabled
        />
      )}
    </>
  );
}
