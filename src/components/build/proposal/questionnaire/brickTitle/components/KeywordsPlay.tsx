import React from "react";

import './KeywordsPlay.scss';
import { KeyWord } from "model/brick";

interface KeyWordsProps {
  keywords?: KeyWord[];
  onClick?(keyword: KeyWord): void;
}

const KeyWordsPlay: React.FC<KeyWordsProps> = ({ keywords, onClick }) => {
  const renderKeyWord = (k: KeyWord, i: number) => {
    return (
      <div key={i} className='key-word-play' onClick={() => onClick?.(k)}>
        {i > 0 ? ' • ' : ''} {k.name.trim()} {' '}
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
