import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


export interface HorizontalShuffleProps {
}

const HorizontalShuffleComponent: React.FC<HorizontalShuffleProps> = () => {
  return (
    <div className="input-box ">
      <DragIndicatorIcon />
      <div>
        HorizontalShuffleComponent
      </div>
    </div>
  )
}

export default HorizontalShuffleComponent
