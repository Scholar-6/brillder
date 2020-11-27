import React from "react";
import { Grid } from "@material-ui/core";
import {QuestionValueType} from '../../types';
import {Answer} from '../types';
import QuestionImageDropZone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import SpriteIcon from "components/baseComponents/SpriteIcon";


export interface PairOptionProps {
  locked: boolean;
  editOnly: boolean;
  index: number;
  answer: Answer;
  validationRequired: boolean;
  save(): void;
  update(): void;
}

const PairOptionComponent: React.FC<PairOptionProps> = ({
  locked, editOnly, index, answer, validationRequired, save, update
}) => {
  const removeImage = () => {
    if (locked) { return; }
    answer.optionFile = "";
    answer.optionType = QuestionValueType.None;
    update();
    save();
  }

  const renderDeleteButton = () => {
    if (answer.optionType === QuestionValueType.Image) {
      return (
        <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeImage()}>
          <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
        </button>
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

  const setImage = (fileName: string) => {
    if (locked) {return;}
    answer.option = "";
    answer.optionFile = fileName;
    answer.optionType = QuestionValueType.Image;
    update();
    save();
  }

  let customClass = '';
  if (answer.optionType === QuestionValueType.Image || answer.answerType === QuestionValueType.Image) {
    customClass = 'pair-image';
  }

  return (
    <Grid container item xs={6}>
      <div className={`unique-component pair-match-option ${customClass}`}>
        <DocumentWirisCKEditor
          disabled={locked}
          editOnly={editOnly}
          data={answer.option}
          validationRequired={validationRequired}
          toolbar={['latex', 'chemType']}
          placeholder={"Enter Option " + (index + 1) + "..."}
          onBlur={() => save()}
          onChange={value => optionChanged(answer, value)}
        />
        <QuestionImageDropZone
          answer={answer as any}
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
