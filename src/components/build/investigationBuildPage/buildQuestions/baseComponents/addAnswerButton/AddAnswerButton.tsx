import React from 'react'
import { Button } from '@material-ui/core';
import AnimateHeight from 'react-animate-height';

import './AddAnswerButton.scss'


export interface AddAnswerButtonProps {
  locked: boolean
  label: string
  height: any
  addAnswer(): void
}

const AddAnswerButton: React.FC<AddAnswerButtonProps> = ({ label, locked, height, addAnswer }) => {
  return (
    <AnimateHeight
      duration={500}
      height={height}
    >
      <div className="button-box">
        <Button className="add-answer-button" disabled={locked} onClick={addAnswer}>
          {label}
        </Button>
      </div>
    </AnimateHeight>
  )
}

export default AddAnswerButton
