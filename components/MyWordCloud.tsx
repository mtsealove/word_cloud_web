import WordCloud from 'react-d3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { useCallback, useMemo } from 'react';
import { Word } from 'react-d3-cloud/lib/WordCloud';

type MyWordCloud = {
    font: string;
    fontWeight: string;
    words: IWord[];
}

const MyWordCloud = ({ font, words, fontWeight }:MyWordCloud) => {
  const data = useMemo(() => words.map((w) => ({
    text: w.text,
    value: w.value * 360 + w.rotate,
  })), [words]);
  const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);
  const fontSize = useCallback((word: Word) => Math.sqrt(word.value), []);
  const rotate = useCallback((word: Word) => word.value % 360, []);
  const fill = useCallback((d: any, i: any) => schemeCategory10ScaleOrdinal(i), []);
  return (
        <WordCloud
            data={data}
            width={500}
            height={500}
            font={font}
            fontWeight={fontWeight}
            fontSize={fontSize}
            spiral="archimedean"
            rotate={rotate}
            padding={5}
            // random={Math.random}
            fill={fill}
        />
  );
};

export default MyWordCloud;
