import React from 'react'
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import CommentIndicator from '../baseComponents/CommentIndicator';

export interface DragTabProps {
  questionId: any
  index: number,
  active: boolean,
  isValid: boolean;
  selectQuestion: Function,
  removeQuestion: Function,
  getHasReplied(questionId: number): number
}

const DragTab: React.FC<DragTabProps> = ({
  questionId, index, active, isValid, selectQuestion, removeQuestion, getHasReplied
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
    return (
      <div className="remove-icon svgOnHover active" onClick={removeTab}>
        <SpriteIcon name="circle-remove" className="w100 h100 active" />
        <div className="css-custom-tooltip">Delete question</div>
      </div>
    );
  }

  const replyType = getHasReplied(questionId);

  return (
    <div className={isValid ? "drag-tile valid" : "drag-tile invalid"}>
      <div className="draggable-tab" onClick={activateTab}>
        <div className='tab-number'>
          {index + 1}
        </div>
        <CommentIndicator replyType={replyType} />
        {renderRemoveIcon()}
      </div>
    </div>
  )
}

export default DragTab
