import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Theme from '../../Theme';
import { ContentDataBase } from './Contents';
import { HeaderText, HeaderTextData } from './HeaderText';
import { SubheaderText, SubheaderTextData } from './SubheaderText';
import { Text, TextData } from './Text';

export interface HeaderContentData extends ContentDataBase {
  type: 'Header';
  headerText: HeaderTextData;
  subheaderText: SubheaderTextData;
  lineTexts?: TextData[];
  style?: StyleProp<ViewStyle>;
  design?: HeaderDesign;
}

type HeaderDesign = 'screen' | 'section' | 'title';

/**
 * Data that defines Header but without the type
 * (useful when you want to use Header in another component)
 */
export type HeaderData = Omit<HeaderContentData, 'type'>;

/** Props the Header needs to function */
export interface HeaderProps extends HeaderData {}

export const Header = ({
  headerText,
  subheaderText,
  lineTexts = [],
  style,
  design = 'screen',
}: HeaderProps) => {
  const designStyle = styles[design] || baseStyle;
  return (
    <View style={[designStyle.headerView, style]}>
      <HeaderText
        {...headerText}
        style={[designStyle.headerText, headerText.style]}
      />
      <SubheaderText
        {...subheaderText}
        style={[designStyle.subheaderText, subheaderText.style]}
      />
      {lineTexts.map(lineText => (
        <Text
          key={lineText.text}
          {...lineText}
          style={[designStyle.lineText, lineText.style]}
        />
      ))}
    </View>
  );
};

const baseStyle = StyleSheet.create({
  headerView: {
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: Theme.default.backgroundColor,
    paddingHorizontal: 15,
    width: '100%',
    borderBottomWidth: 10,
    borderBottomColor: Theme.dimmed.backgroundColor,
  },
  headerText: {
    textAlign: 'center',
  },
  subheaderText: {
    marginTop: 5,
    textAlign: 'center',
  },
  lineText: {
    marginTop: 20,
    textAlign: 'center',
  },
});

const styles = {
  screen: {
    ...baseStyle,
    headerView: StyleSheet.compose(
      baseStyle.headerView,
      StyleSheet.create({ headerView: { paddingTop: 15, paddingBottom: 15 } })
        .headerView,
    ),
    headerText: StyleSheet.compose(
      baseStyle.headerText,
      StyleSheet.create({ headerText: { fontWeight: '700', fontSize: 20 } })
        .headerText,
    ),
  },
  section: {
    ...baseStyle,
    headerView: StyleSheet.compose(
      baseStyle.headerView,
      StyleSheet.create({ headerView: { width: '90%' } }).headerView,
    ),
  },
  title: baseStyle,
};
