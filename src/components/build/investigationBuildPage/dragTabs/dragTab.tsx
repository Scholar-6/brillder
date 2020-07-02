import React from 'react'

import sprite from "../../../../assets/img/icons-sprite.svg";

export interface DragTabProps {
  id: any
  index: number,
  active: boolean,
  isValid: boolean,
  selectQuestion: Function,
  removeQuestion: Function
}

const DragTab: React.FC<DragTabProps> = ({ id, index, active, isValid, selectQuestion, removeQuestion }) => {
  const removeTab = (event: React.ChangeEvent<any>) => {
    event.stopPropagation();
    removeQuestion(index);
  }

  const activateTab = () => {
    selectQuestion(index);
  }

  return (
    <div className="draggable-tab" onClick={activateTab}>
      <div className="tab-number">
        {index + 1}
      </div>
      <div className={active ? 'remove-icon svgOnHover active' : 'remove-icon svgOnHover'} onClick={removeTab}>
        <svg className="svg w100 h100 active">
          <use href={sprite + "#cancel"} className="text-theme-dark-blue" />
        </svg>
      </div>
    </div>
  )
}

export default DragTab
