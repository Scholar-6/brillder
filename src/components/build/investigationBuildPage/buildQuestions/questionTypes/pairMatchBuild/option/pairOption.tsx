import React from "react";
import { Grid } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import {QuestionValueType} from '../../types';
import {Answer} from '../types';
import QuestionImageDropZone from '../../../baseComponents/QuestionImageDropzone';


export interface PairOptionProps {
  locked: boolean;
  index: number;
  answer: Answer;
  update(): void;
}

const PairOptionComponent: React.FC<PairOptionProps> = ({
  locked, index, answer, update
}) => {
  const removeImage = () => {
    if (locked) { return; }
    answer.optionFile = "";
    answer.optionType = QuestionValueType.None;
    update();
  }

  const renderDeleteButton = () => {
    if (answer.optionType === QuestionValueType.Image) {
      return (
        <DeleteIcon
          className="right-top-icon"
          style={{ right: "1%", top: "2%" }}
          onClick={() => removeImage()}
        />
      );
    }
    return "";
  }

  const optionChanged = (answer: Answer, value: string) => {
    if (locked) { return; }
    answer.option = value;
    answer.optionFile = "";
    answer.optionType = QuestionValueType.String;
    update();
  }

  const renderImagePreview = () => {
    return (
      <Grid
        container direction="row"
        justify="center" alignContent="center"
        style={{height: '4vw'}}
      >
        <img alt="" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${answer.optionFile}`} />
      </Grid>
    );
  }

  const setImage = (fileName: string) => {
    if (locked) {return;}
    answer.option = "";
    answer.optionFile = fileName;
    answer.optionType = QuestionValueType.Image;
    update();
  }

  let customClass = '';
  if (answer.optionType === QuestionValueType.Image || answer.answerType === QuestionValueType.Image) {
    customClass = 'pair-image';
  }

  return (
    <Grid container item xs={6}>
      <div className={`pair-match-option ${customClass}`}>
        <input
          disabled={locked}
          value={answer.option}
          onChange={(event) => optionChanged(answer, event.target.value)}
          placeholder={"Enter Option " + (index + 1) + "..."}
        />
        <QuestionImageDropZone
          answer={answer}
          type={answer.optionType || QuestionValueType.None}
          fileName={answer.optionFile}
          locked={locked}
          update={setImage}
        />
        {renderDeleteButton()}
      </div>
    </Grid>
  );
};

export default PairOptionComponent;
