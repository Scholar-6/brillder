import React from 'react'
import SpriteIcon from 'components/baseComponents/SpriteIcon';

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
        <SpriteIcon name="cancel" className={`w100 h100 active ${color}`} />
      </div>
    );
  }

  let tabClass = 'tab-number';
  if (!isValid && active) {
    tabClass += ' text-white';
  }

  const replyType = getHasReplied(id);

  return (
    <div className={isValid ? "drag-tile valid" : "drag-tile invalid"}>
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
    </div>
  )
}

export default DragTab
