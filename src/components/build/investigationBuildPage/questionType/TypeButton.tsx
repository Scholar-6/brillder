import React from 'react'
import { Grid, Box } from '@material-ui/core';
import { QuestionTypeEnum } from 'model/question';

import './type.scss';

export interface TypeButtonProps {
  labels: string[],
  isActive: boolean,
  activeType: QuestionTypeEnum,
  questionType: QuestionTypeEnum,
  onMouseEnter(type: QuestionTypeEnum): void
  onMouseLeave(): void
  setType(e: any): void,
}

const TypeButton: React.FC<TypeButtonProps> = ({
  labels, activeType, questionType, setType, onMouseEnter, onMouseLeave
}) => {
  const renderLabel = (label: string, i: number) => {
    return (
      <div className="link-description" key={i}>
        <span>{label}</span>
      </div>
    )
  };

  let className = "";
  if (activeType === questionType) {
    className = "active";
  }
  return (
    <div className={`question-container ${className}`}
      onClick={() => setType(questionType)}
      onMouseEnter={() => onMouseEnter(questionType)}
      onMouseLeave={onMouseLeave}>
      {labels.map((label: string, i: number) => renderLabel(label, i + 1))}
    </div>
  );
}

export default TypeButton
