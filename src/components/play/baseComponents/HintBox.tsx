import React from 'react';
import HintIcon from './HintIcon';
import MathInHtml from './MathInHtml';

interface ReviewHintProps {
  correct: boolean;
  value: string;
}

const HintBox: React.FC<ReviewHintProps> = ({ correct, value }) => {
  return (
    <div>
      <HintIcon correct={correct} />
      <span className="bold">{correct ? 'NB' : 'Hint'}: </span>
      <MathInHtml className="inline" value={value} />
    </div>
  )
}

export default HintBox;
