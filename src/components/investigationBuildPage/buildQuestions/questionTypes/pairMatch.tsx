import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


export interface PairMatchComponentProps {
}

const PairMatchComponent: React.FC<PairMatchComponentProps> = () => {
  return (
    <div className="input-box ">
      <DragIndicatorIcon />
      <div>
        <input placeholder="Enter correct answer" />
      </div>
    </div>
  )
}

export default PairMatchComponent
