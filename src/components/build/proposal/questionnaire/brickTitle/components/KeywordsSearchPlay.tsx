import React from "react";

import './KeywordsPlay.scss';
import { KeyWord } from "model/brick";
import SearchText from "components/baseComponents/SearchText";

interface KeyWordsProps {
  searchString: string;
  keywords?: KeyWord[];
}

const KeyWordsSearchPlay: React.FC<KeyWordsProps> = ({ searchString, keywords }) => {
  const renderKeyWord = (k: KeyWord, i: number) => {

    return (
      <div key={i} className='key-word-play'>
        {i > 0 ? ' • ' : ''} <SearchText key={0} searchString={searchString} text={k.name.trim()} /> {' '}
      </div>
    );
  }
  return (
    <div className="key-words-play">
      {keywords && keywords.map(renderKeyWord)}
    </div>
  );
}

export default KeyWordsSearchPlay;
