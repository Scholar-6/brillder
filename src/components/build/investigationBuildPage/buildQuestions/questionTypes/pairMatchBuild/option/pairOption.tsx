import React from "react";
import { Grid } from "@material-ui/core";
import sprite from "../../../../../../../assets/img/icons-sprite.svg";
import {QuestionValueType} from '../../types';
import {Answer} from '../types';
import QuestionImageDropZone from '../../../baseComponents/QuestionImageDropzone';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';


export interface PairOptionProps {
  locked: boolean;
  index: number;
  answer: Answer;
  validationRequired: boolean;
  save(): void;
  update(): void;
}

const PairOptionComponent: React.FC<PairOptionProps> = ({
  locked, index, answer, validationRequired, save, update
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
          <svg className="svg active back-button">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#trash-outline"} className="theme-orange" />
          </svg>
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
          data={answer.option}
          validationRequired={validationRequired}
          toolbar={['mathType', 'chemType']}
          placeholder={"Enter Option " + (index + 1) + "..."}
          onBlur={() => save()}
          onChange={value => optionChanged(answer, value)}
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
