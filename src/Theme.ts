import { ColorValue, StyleSheet } from 'react-native';

type Colors = {
  background: string;
  textDark: string;
  textLight: string;
  fillLight: string;
  fillMid: string;
  fillDark: string;
  primary: string;
  primaryLight: string;
  accent: string;
  accentDark: string;
};

type ColorMap = {
  [theme: string]: Colors;
};

export const themes: ColorMap = require('../assets/data/colors.json');

const theme: Colors = themes['light'];

export default theme;
