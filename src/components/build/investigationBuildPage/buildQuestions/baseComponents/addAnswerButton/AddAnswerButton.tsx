import React from 'react'
import { Button } from '@material-ui/core';
import AnimateHeight from 'react-animate-height';

import './AddAnswerButton.scss'


export interface AddAnswerButtonProps {
  label: string
  height: any
  addAnswer(): void
}

const AddAnswerButton: React.FC<AddAnswerButtonProps> = ({ label, height, addAnswer }) => {
  return (
    <AnimateHeight
      duration={500}
      height={height}
    >
      <div className="button-box">
        <Button className="add-answer-button" onClick={addAnswer}>
          {label}
        </Button>
      </div>
    </AnimateHeight>
  )
}

export default AddAnswerButton
