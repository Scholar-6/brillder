import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react'
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
    <AnimateHeight className={"add-button-container unselectable " + (locked ? 'hide' : '')} duration={500} height={height}>
      <div className="button-box">
        <button className="btn btn-xl btn-block bg-light-blue"  onClick={addAnswer}>
          <SpriteIcon name="plus-circle" /><span>{label}</span>
        </button>
      </div>
    </AnimateHeight>
  )
}

export default AddAnswerButton
