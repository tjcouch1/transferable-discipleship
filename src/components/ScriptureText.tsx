import { ScriptureVerseRangeContent } from '../services/ScriptureService';
import { sup } from '../util/Util';
import { Text, TextData } from './contents/Text';

export type ScriptureTextProps = {
  scriptureText: ScriptureVerseRangeContent;
} & Omit<TextData, 'text'>;

export const ScriptureText = ({
  scriptureText,
  // Default design to small to overwrite default in Text
  design = 'small',
  ...textProps
}: ScriptureTextProps) => {
  const text = scriptureText.verses
    .map(v => `${sup(v.verse.toString())} ${v.text}`)
    .join(' ')
    .replace(/\n/g, ' ');

  return <Text {...textProps} text={text} design={design} />;
};
