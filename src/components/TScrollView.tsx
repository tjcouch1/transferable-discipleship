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

import { ScrollView, ScrollViewProps } from 'react-native';
import { isWeb } from '../util/Util';

export type TScrollViewProps = ScrollViewProps & { bottomPadding?: number };

export default function TScrollView({
  bottomPadding,
  ...scrollViewProps
}: TScrollViewProps) {
  return (
    <ScrollView
      {...scrollViewProps}
      // Bottom padding thanks to jgbaEmento at https://github.com/facebook/react-native/issues/15707#issuecomment-340759872
      contentContainerStyle={[
        {
          paddingBottom: bottomPadding || 0,
        },
        scrollViewProps.contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={
        !isWeb() && scrollViewProps.showsVerticalScrollIndicator
      }
      showsHorizontalScrollIndicator={
        !isWeb() && scrollViewProps.showsHorizontalScrollIndicator
      }></ScrollView>
  );
}
