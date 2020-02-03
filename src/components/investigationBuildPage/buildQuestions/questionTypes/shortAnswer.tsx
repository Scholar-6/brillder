import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


export interface ShortAnswerProps {
}

const ShortAnswerComponent: React.FC<ShortAnswerProps> = () => {
  return (
    <div className="input-box ">
      <DragIndicatorIcon />
      <div>
        <input placeholder="Enter correct answer" />
      </div>
    </div>
  )
}

export default ShortAnswerComponent
