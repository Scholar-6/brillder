import React from 'react';

import { Question } from "components/model/question";


interface ShortAnswerProps {
  question: Question;
}


const ShortAnswer: React.FC<ShortAnswerProps> = ({ question }) => {
  console.log(question);
  return <div>Short Answer</div>;
}

export default ShortAnswer;
