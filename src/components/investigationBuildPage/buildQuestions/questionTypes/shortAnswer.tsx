import React from 'react'
import update from 'immutability-helper';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

export interface ShortAnswerProps {
  data: any
  updateComponent(component:any):void
}

const ShortAnswerComponent: React.FC<ShortAnswerProps> = ({data, updateComponent}) => {
  let value = ""
  if (data.value) {
    value = data.value;
  }
  const changed = (event: any) => {
    data.value = event.target.value;
    updateComponent(data);
  }
  return (
    <div className="input-box">
      <DragIndicatorIcon />
      <div>
        <input value={value} onChange={changed} placeholder="Enter correct answer" />
      </div>
    </div>
  )
}

export default ShortAnswerComponent
