import { ImageSourcePropType } from 'react-native';

const images = {
  icon: require('../../assets/favicon.png'),
};

type ImageKey = keyof typeof images;

type ImageRemoteUrl = `https://${string}` | `data:${string}`

export type ImageUrl = ImageKey | ImageRemoteUrl;

export function isRemote(imageUrl: ImageUrl): imageUrl is ImageRemoteUrl {
  return imageUrl.startsWith('https://') || imageUrl.startsWith('data:');
}

/** Gets the url for an image. Use as `source` prop in `<Image/>` component */
export function getImageSource(imageUrl: ImageUrl): ImageSourcePropType {
  if (isRemote(imageUrl))
    return { uri: imageUrl };
  return images[imageUrl];
}
