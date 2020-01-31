import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


export interface LineHighlightingProps {
}

const LineHighlightingComponent: React.FC<LineHighlightingProps> = () => {
  return (
    <div className="input-box ">
      <DragIndicatorIcon />
      <div>
        LineHighlightingComponent
      </div>
    </div>
  )
}

export default LineHighlightingComponent
