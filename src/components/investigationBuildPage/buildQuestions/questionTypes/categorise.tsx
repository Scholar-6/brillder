import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


export interface CategoriseProps {
}

const CategoriseComponent: React.FC<CategoriseProps> = () => {
  return (
    <div className="input-box ">
      <DragIndicatorIcon />
      <div>
        <input placeholder="Enter correct answer" />
      </div>
    </div>
  )
}

export default CategoriseComponent
