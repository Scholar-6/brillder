import React from "react";
import { Grid } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from "@material-ui/icons/Delete";

import {Answer, PairBoxType} from '../types';
import {uploadFile} from 'components/services/uploadFile';


export interface PairOptionProps {
  locked: boolean;
  index: number;
  answer: Answer;
  update(): void;
}

const PairOptionComponent: React.FC<PairOptionProps> = ({
  locked, index, answer, update
}) => {
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    disabled: locked,
    onDrop: (files:any[]) => {
      return uploadFile(files[0] as File, (res: any) => {
        if (locked) {return;}
        answer.option = "";
        answer.optionFile = res.data.fileName;
        answer.optionType = PairBoxType.Image;
        update();
      }, () => { });
    }
  });

  const removeImage = () => {
    if (locked) { return; }
    answer.optionFile = "";
    answer.optionType = PairBoxType.None;
    update();
  }

  const renderDeleteButton = () => {
    if (answer.optionType === PairBoxType.Image) {
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
    answer.optionType = PairBoxType.String;
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

  const renderEmptyPreview = () => {
    return (
      <Grid
        container direction="row"
        justify="center" alignContent="center"
        className="drop-placeholder"
      >
        <AddCircleIcon /> jpg.
      </Grid>
    );
  }

  const renderDropBox = () => {
    return (
      <div className="pair-option-image-drop">
        <div {...getRootProps({className: 'dropzone ' + ((locked) ? 'disabled' : '')})}>
          <input {...getInputProps()} />
          {
            answer.optionType === PairBoxType.Image
              ? renderImagePreview()
              : renderEmptyPreview()
          }
        </div>
      </div>
    );
  }

  let customClass = '';
  if (answer.optionType === PairBoxType.Image || answer.answerType === PairBoxType.Image) {
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
        {renderDropBox()}
        {renderDeleteButton()}
      </div>
    </Grid>
  );
};

export default PairOptionComponent;
