import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import Checkbox from "@material-ui/core/Checkbox";

import './ChooseOneAnswer.scss'; 
import DocumentCKEditor from "components/baseComponents/DocumentEditor";
import AddImageBtnContent from '../../baseComponents/AddImageBtnContent';


export interface ChooseOneAnswerProps {
  locked: boolean;
  index: number;
  length: number;
  answer: any;
  removeFromList(index: number): void;
  onChecked(event: any, checked: boolean): void;
  changed(answer: any, value: string): void;
}

const ChooseOneAnswerComponent: React.FC<ChooseOneAnswerProps> = ({
  locked, index, length, answer,
  removeFromList, changed, onChecked
}) => {
  const renderDeleteButton = () => {
    if (length > 3) {
      return (
        <DeleteIcon
          className="right-top-icon"
          onClick={() => removeFromList(index)}
        />
      );
    }

    return "";
  }

  return (
    <div className="choose-one-box unique-component-box" key={index}>
      {renderDeleteButton()}
      <Checkbox
        className="left-ckeckbox"
        disabled={locked}
        checked={answer.checked}
        onChange={onChecked}
        value={index}
      />
      <AddImageBtnContent />
      <DocumentCKEditor
        data={answer.value}
        toolbar={['mathType', 'chemType']}
        placeholder="Enter Answer..."
        onChange={value => changed(answer, value)}
      />
    </div>
  );
};

export default ChooseOneAnswerComponent;
