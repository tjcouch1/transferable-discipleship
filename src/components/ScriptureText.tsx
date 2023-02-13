import { ScriptureVerseRangeContent } from '../services/ScriptureService';
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
  const text = JSON.stringify(
    scriptureText.verses
      .map(v => `${v.verse} ${v.text}`)
      .join(' ')
      .replace(/\n/g, ' '),
  );

  return <Text {...textProps} text={text} design={design} />;
};
