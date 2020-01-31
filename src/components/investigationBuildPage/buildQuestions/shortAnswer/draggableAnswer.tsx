import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


export interface DragShortAnswerProps {
  value: string,
}

const DraggableShortAnswer: React.FC<DragShortAnswerProps> = () => {
  return (
    <div className="input-box ">
      <DragIndicatorIcon />
      <div>
        <input placeholder="Enter correct answer" />
      </div>
    </div>
  )
}
export default DraggableShortAnswer
