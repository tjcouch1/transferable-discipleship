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

import { ImageRequireSource, ImageURISource } from 'react-native';

const images = {
  icon: require('../../assets/favicon.png'),
  'cycles-of-involvement': require('../../assets/images/cycles-of-involvement.png'),
  invite: require('../../assets/images/invite.png'),
  nations: require('../../assets/images/nations.png'),
  'spiritual-multiplication': require('../../assets/images/spiritual-multiplication.png'),
};

type ImageKey = keyof typeof images;

type ImageRemoteUrl = `https://${string}` | `data:${string}`;

export type ImageUrl = ImageKey | ImageRemoteUrl;

export function isRemote(imageUrl: ImageUrl): imageUrl is ImageRemoteUrl {
  return imageUrl.startsWith('https://') || imageUrl.startsWith('data:');
}

/** Gets the url for an image. Use as `source` prop in `<Image/>` component */
export function getImageSource(
  imageUrl: ImageUrl,
): ImageURISource | ImageRequireSource {
  if (isRemote(imageUrl)) return { uri: imageUrl };
  return images[imageUrl];
}
