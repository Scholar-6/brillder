import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import CommentIndicator from "../baseComponents/CommentIndicator";

export interface DragTabProps {
  questionId: any;
  index: number;
  deleteHidden?: boolean;
  active: boolean;
  isValid: boolean;
  selectQuestion: Function;
  removeQuestion: Function;
  getHasReplied(questionId: number): number;
}

const DragTab: React.FC<DragTabProps> = ({ index, ...props }) => {
  const removeTab = (event: React.ChangeEvent<any>) => {
    event.stopPropagation();
    props.removeQuestion(index);
  };

  const activateTab = () => {
    props.selectQuestion(index);
  };

  const renderRemoveIcon = () => {
    if (!props.active || props.deleteHidden) {
      return;
    }
    return (
      <div className="remove-icon svgOnHover active" onClick={removeTab}>
        <SpriteIcon name="circle-remove" className="w100 h100 active" />
        <div className="css-custom-tooltip">Delete question</div>
      </div>
    );
  };

  const replyType = props.getHasReplied(props.questionId);

  return (
    <div className={props.isValid ? "drag-tile valid" : "drag-tile invalid"}>
      <div className="draggable-tab" onClick={activateTab}>
        <div className="tab-number">{index + 1}</div>
        <CommentIndicator replyType={replyType} />
        {renderRemoveIcon()}
      </div>
    </div>
  );
};

export default DragTab;
