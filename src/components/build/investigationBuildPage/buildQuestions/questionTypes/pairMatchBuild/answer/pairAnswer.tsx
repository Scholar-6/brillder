import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { Grid } from "@material-ui/core";
import { useDropzone } from "react-dropzone";

import {Answer,  PairBoxType} from '../types';
import {uploadFile} from 'components/services/uploadFile';


export interface PairAnswerProps {
  locked: boolean;
  index: number;
  length: number;
  answer: Answer;
  removeFromList(index: number): void;
  update(): void;
}

const PairAnswerComponent: React.FC<PairAnswerProps> = ({
  locked, index, length, answer,
  removeFromList, update
}) => {
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    disabled: locked,
    onDrop: (files:any[]) => {
      return uploadFile(files[0] as File, (res: any) => {
        if (locked) {return;}
        answer.value = "";
        answer.valueFile = res.data.fileName;
        answer.answerType = PairBoxType.Image;
        update();
      }, () => { });
    }
  });

  const answerChanged = (answer: Answer, value: string) => {
    if (locked) { return; }
    answer.value = value;
    answer.valueFile = "";
    answer.answerType = PairBoxType.String;
    update();
  }

  const renderDeleteButton = () => {
    if (length > 3) {
      return (
        <DeleteIcon
          className="right-top-icon"
          style={{ right: "1%" }}
          onClick={() => removeFromList(index)}
        />
      );
    }
    return "";
  }

  const renderImagePreview = () => {
    return (
      <Grid
        container direction="row"
        justify="center" alignContent="center"
        style={{height: '100%'}}
      >
        <img alt="" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${answer.valueFile}`} />
      </Grid>
    );
  }

  const renderEmptyPreview = () => {
    return (
      <Grid
        container direction="row"
        justify="center" alignContent="center"
        className="drop-placeholder"
      >
        Img
      </Grid>
    );
  }

  const renderDropBox = () => {
    return (
      <div className="pair-answer-image-drop">
        <div {...getRootProps({className: 'dropzone ' + ((locked) ? 'disabled' : '')})}>
          <input {...getInputProps()} />
          {
            answer.answerType === PairBoxType.Image
              ? renderImagePreview()
              : renderEmptyPreview()
          }
        </div>
      </div>
    );
  }


  return (
    <Grid container item xs={6}>
      <div className="pair-match-answer">
        {renderDeleteButton()}
        <input
          disabled={locked}
          value={answer.value}
          onChange={(event:any) => answerChanged(answer, event.target.value)}
          placeholder={"Enter Answer " + (index + 1) + "..."}
        />
        {renderDropBox()}
      </div>
    </Grid>
  );
};

export default PairAnswerComponent;
