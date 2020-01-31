import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


export interface WordHighlightingProps {
}

const WordHighlightingComponent: React.FC<WordHighlightingProps> = () => {
  return (
    <div className="input-box ">
      <DragIndicatorIcon />
      <div>
        WordHighlightingComponent
      </div>
    </div>
  )
}

export default WordHighlightingComponent
