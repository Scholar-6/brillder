import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


export interface ShortAnswerProps {
  data: any
  updateComponent(component:any):void
}

const ShortAnswerComponent: React.FC<ShortAnswerProps> = ({data, updateComponent}) => {
  if (data.value) {
    data.value = "";
  }
  const setValue = (event: any) => {
    data.value = event.target.value;
    updateComponent(data);
  }
  return (
    <div className="input-box">
      <DragIndicatorIcon />
      <div>
        <input value={data.value} onChange={setValue} placeholder="Enter correct answer" />
      </div>
    </div>
  )
}

export default ShortAnswerComponent
