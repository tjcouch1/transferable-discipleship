import { ScrollView, ScrollViewProps } from 'react-native';
import { isWeb } from '../util/Util';

export default function TScrollView(props: ScrollViewProps) {
  return (
    <ScrollView
      {...props}
      showsVerticalScrollIndicator={
        !isWeb() && props.showsVerticalScrollIndicator
      }
      showsHorizontalScrollIndicator={
        !isWeb() && props.showsHorizontalScrollIndicator
      }></ScrollView>
  );
}
