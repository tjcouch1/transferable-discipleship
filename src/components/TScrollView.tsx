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
