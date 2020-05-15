import React from "react";
import { Grid } from "@material-ui/core";
import { useDropzone } from "react-dropzone";

import './QuestionImageDropzone.scss';
import {uploadFile} from 'components/services/uploadFile';
import { PairBoxType } from "../questionTypes/pairMatchBuild/types";
import AddImageBtnContent from "./AddImageBtnContent";


export interface AnswerProps {
  locked: boolean;
  type: PairBoxType;
  fileName: string;
  answer: any;
  update(fileName: string): void;
}
  
const QuestionImageDropzone: React.FC<AnswerProps> = ({
  locked, answer, fileName, type, update
}) => {
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    disabled: locked,
    onDrop: (files:any[]) => {
      return uploadFile(files[0] as File, (res: any) => {
        update(res.data.fileName);
      }, () => { });
    }
  });

  const renderImagePreview = () => {
    return (
      <Grid
        container direction="row"
        justify="center" alignContent="center"
        style={{height: '100%'}}
      >
        <img
          alt=""
          src={`${process.env.REACT_APP_BACKEND_HOST}/files/${fileName}`}
        />
      </Grid>
    );
  }

  return (
    <div className="question-image-drop">
      <div {...getRootProps({className: 'dropzone ' + ((locked) ? 'disabled' : '')})}>
        <input {...getInputProps()} />
        {
          type === PairBoxType.Image
            ? renderImagePreview()
            : <AddImageBtnContent />
        }
      </div>
    </div>
  )
};

export default QuestionImageDropzone;
