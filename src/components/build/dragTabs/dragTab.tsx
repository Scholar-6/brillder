import React from 'react'

import sprite from "assets/img/icons-sprite.svg";

export interface DragTabProps {
  id: any
  index: number,
  active: boolean,
  isValid: boolean;
  selectQuestion: Function,
  removeQuestion: Function,
  getHasReplied(questionId: number): number
}

const DragTab: React.FC<DragTabProps> = ({
  id, index, active, isValid, selectQuestion, removeQuestion, getHasReplied
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

  const replyType = getHasReplied(id);

  return (
    <div className="draggable-tab" onClick={activateTab}>
      <div className={tabClass}>
        {index + 1}
      </div>
      {
        (replyType !== 0) &&
        <div className={"unread-indicator svgOnHover active" + (replyType > 0 ? " has-replied" : "")}>
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
