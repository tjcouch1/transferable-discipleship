import { ColorValue, StyleSheet } from 'react-native';

type Colors = {
  app: {
    background: string;
  };
  navigation: {
    background: string;
    text: string;
    bottom: string;
  };
  header: {
    background: string;
    headerText: string;
    subheaderText: string;
    lineText: string;
    bottom: string;
  };
  slide: {
    background: string;
    headerText: string;
    headerTextPrimary: string;
    bottom: string;
  };
  button: {
    background: string;
    text: string;
    backgroundAnswer: string;
    textAnswer: string;
  };
  text: {
    headerText: string;
    subheaderText: string;
    lineText: string;
  };
};

type ColorMap = {
  [theme: string]: Colors;
};

export const themes: ColorMap = require('../assets/data/colors.json');

const theme: Colors = themes['light'];

export default theme;
