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
