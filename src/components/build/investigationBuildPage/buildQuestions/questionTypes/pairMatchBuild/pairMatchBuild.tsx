import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


export interface PairMatchBuildComponentProps {
}

const PairMatchBuildComponent: React.FC<PairMatchBuildComponentProps> = () => {
  return (
    <div className="input-box ">
      <DragIndicatorIcon />
      <div>
        PairMatchComponent
      </div>
    </div>
  )
}

export default PairMatchBuildComponent
