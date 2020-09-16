import React from 'react'

import sprite from "assets/img/icons-sprite.svg";

export interface DragTabProps {
  id: any
  index: number,
  active: boolean,
  isValid: boolean;
  selectQuestion: Function,
  removeQuestion: Function,
  getUnreadComments(questionId: number): number
  getHasReplied(questionId: number): boolean
}

const DragTab: React.FC<DragTabProps> = ({
  id, index, active, isValid, selectQuestion, removeQuestion, getUnreadComments, getHasReplied
}) => {
  const removeTab = (event: React.ChangeEvent<any>) => {
    event.stopPropagation();
    removeQuestion(index);
  }

  const activateTab = () => {
    selectQuestion(index);
  }

  const renderRemoveIcon = () => {
    if (!active) { return; }
    let color = 'text-theme-dark-blue'
    if (!isValid) {
      color = 'text-white';
    }
    return (
      <div className="remove-icon svgOnHover active" onClick={removeTab}>
        <svg className="svg w100 h100 active">
          <use href={sprite + "#cancel"} className={color} />
        </svg>
      </div>
    );
  }

  let tabClass = 'tab-number';
  if (!isValid && active) {
    tabClass += ' text-white';
  }

  return (
    <div className="draggable-tab" onClick={activateTab}>
      <div className={tabClass}>
        {index + 1}
      </div>
      {
        (getUnreadComments(id) > 0 || getHasReplied(id)) &&
        <div className={"unread-indicator svgOnHover active" + (getHasReplied(id) ? " has-replied" : "")}>
          <svg className="svg w100 h100 active" viewBox="0 0 24 24" stroke="none" fill="currentColor">
            <circle cx="12" cy="12" r="12" className="outer-circle" />
            <circle cx="12" cy="12" r="6" className="inner-circle" />
          </svg>
        </div>
      }
      {renderRemoveIcon()}
    </div>
  )
}

export default DragTab
