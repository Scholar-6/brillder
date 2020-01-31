import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


export interface VerticalShuffleProps {
  value: string,
}

const VerticalShuffleComponent: React.FC<VerticalShuffleProps> = () => {
  return (
    <div className="input-box ">
      <DragIndicatorIcon />
      <div>
        <input placeholder="Enter correct answer" />
      </div>
    </div>
  )
}

export default VerticalShuffleComponent
