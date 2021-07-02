import React from "react";

import './KeywordsPlay.scss';
import { KeyWord } from "model/brick";

interface KeyWordsProps {
  keywords?: KeyWord[];
}

const KeyWordsPlay: React.FC<KeyWordsProps> = ({ keywords }) => {
  const renderKeyWord = (k: KeyWord, i: number) => {
    return (
      <div key={i} className='key-word-play'>
        {i > 0 ? ' | ' : ''} {k.name.trim()} {' '}
      </div>
    );
  }
  return (
    <div className="key-words-play">
      {keywords && keywords.map(renderKeyWord)}
    </div>
  );
}

export default KeyWordsPlay;
