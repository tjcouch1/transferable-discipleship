import { ScriptureVerseRangeContent } from '../services/ScriptureService';
import { sup } from '../util/Util';
import { Text, TextDataObject } from './contents/Text';

export type ScriptureTextProps = {
  scriptureText: ScriptureVerseRangeContent;
} & Omit<TextDataObject, 'text'>;

export const ScriptureText = ({
  scriptureText,
  // Default design to small to overwrite default in Text
  design = 'small',
  ...textProps
}: ScriptureTextProps) => {
  // Put superscripted verse numbers and a non-breaking space before the verse
  // Trim the verse to remove extraneous new lines
  const text = scriptureText.verses
    .map(v => `${sup(v.verse.toString())}\xa0${v.text.trim()}`)
    .join(' ');

  return <Text {...textProps} text={text} design={design} />;
};
