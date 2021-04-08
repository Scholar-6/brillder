import React from 'react';
import * as Y from "yjs";
import _ from "lodash";
import YoutubeAndMathQuote from 'components/play/baseComponents/YoutubeAndMathQuote';
import { useObserver } from '../../hooks/useObserver';

interface Props {
  text: Y.Text;
  math?: boolean;
}

const ObservableText: React.FC<Props> = ({ text, math }) => {
  const value = useObserver(text);

  if (math) {
    return <YoutubeAndMathQuote value={value} />;
  }

  return <div dangerouslySetInnerHTML={{ __html: value }} />;
}

export default ObservableText;
