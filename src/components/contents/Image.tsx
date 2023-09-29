import { ImageStyle, StyleProp } from 'react-native';
import { ContentDataBase } from './Contents';
import { Image as ReactImage } from 'react-native';
import { ImageUrl, getImageSource, isRemote } from '../../services/ImageService';
import { isWeb } from '../../util/Util';

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
  return (
    <ReactImage
      source={getImageSource(source)}
      style={[isWeb() || isRemote(source) ? { width: 75, height: 75 } : {}, style]}
    />
  );
}
