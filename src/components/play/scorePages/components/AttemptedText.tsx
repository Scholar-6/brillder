import React from 'react';

interface Props {
  attempted: number;
  attemptsCount: number;
  score: number;
  maxScore: number;
}

const AttemptedText: React.FC<Props> = (props) => {
  return (
    <div className="attempted-text">
      <span className="bold">Attempted:</span> {props.attempted} / {props.attemptsCount}
      <span className="bold"> Marks:</span> {props.score} / {props.maxScore}
    </div>
  );
}

export default AttemptedText;
