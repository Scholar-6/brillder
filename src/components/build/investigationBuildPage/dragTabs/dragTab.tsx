import React from 'react'

import sprite from "assets/img/icons-sprite.svg";

export interface DragTabProps {
  id: any
  index: number,
  active: boolean,
  isValid: boolean,
  selectQuestion: Function,
  removeQuestion: Function,
  getUnreadComments(questionId: number): number
}

const DragTab: React.FC<DragTabProps> = ({ id, index, active, isValid, selectQuestion, removeQuestion, getUnreadComments }) => {
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
      { getUnreadComments(id) > 0 &&
      <div className="unread-indicator svgOnHover active">
        <svg className="svg w100 h100 active" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="12" className="outer-circle" stroke="none" />
          <circle cx="12" cy="12" r="6" className="inner-circle" stroke="none" />
        </svg>
      </div> }
      <div className={active ? 'remove-icon svgOnHover active' : 'remove-icon svgOnHover'} onClick={removeTab}>
        <svg className="svg w100 h100 active">
          <use href={sprite + "#cancel"} className="text-theme-dark-blue" />
        </svg>
      </div>
    </div>
  )
}

export default DragTab
