/**
 * Wraps the application in a "phone" layout on web
 */

import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { isWeb } from '../util/Util';

export default function WebWrapper({ children }: PropsWithChildren) {
  return isWeb() ? (
    <View style={[styles.screen]}>
      <View style={[styles.phone]}>{children}</View>
    </View>
  ) : (
    <>{children}</>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  phone: {
    width: 360,
    height: 720,
    borderWidth: 3,
    borderRadius: 3,
  },
});
