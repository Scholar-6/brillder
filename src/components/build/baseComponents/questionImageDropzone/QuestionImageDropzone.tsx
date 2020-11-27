import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import './QuestionImageDropzone.scss';
import {fileUrl, uploadFile} from 'components/services/uploadFile';
import { QuestionValueType } from "../../buildQuestions/questionTypes/types";
import AddImageBtnContent from "../AddImageBtnContent";
import ImageDialogV2 from "./ImageDialogV2";
import ImageCloseDialog from "components/build/buildQuestions/components/Image/ImageCloseDialog";
import { MainImageProps } from "components/build/buildQuestions/components/Image/model";

export interface ImageAnswerData extends MainImageProps {
  value: string;
  valueFile: string;
}

export interface AnswerProps {
  answer: ImageAnswerData;
  locked: boolean;
  type: QuestionValueType;
  fileName: string;
  update(fileName: string): void;
}

const QuestionImageDropzone: React.FC<AnswerProps> = ({
  locked, answer, fileName, type, update
}) => {
  let [file, setFile] = useState(null);
  let [isOpen, setOpen] = useState(false);
  let [isCloseOpen, setCloseDialog] = useState(false);

  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    disabled: locked,
    onDrop: (files:any[]) => {
      if (files[0]) {
        setFile(files[0]);
        setOpen(true);
      }
    }
  });

  const updateAnswer = (fileName: string, source: string, caption: string, permision: boolean) => {
    if (locked) { return; }
    answer.imageSource = source;
    answer.imageCaption = caption;
    answer.imagePermision = permision;
    update(fileName);
    setOpen(false);
  }

  const upload = (file: File, source: string, caption: string, permision: boolean) => {
    if (locked) { return; }
    return uploadFile(file, (res: any) => {
      updateAnswer(res.data.fileName, source, caption, permision);
    }, () => { });
  }

  const updateData = (source: string, caption: string, permision: boolean) => {
    updateAnswer(answer.valueFile, source, caption, permision);
  }
 
  const renderImagePreview = () => {
    return (
      <img src={fileUrl(fileName)} alt="" width="100%" height="auto"/>
    );
  }

  return (
    <div className="question-image-drop">
      <div {...getRootProps({className: 'dropzone ' + ((locked) ? 'disabled' : '')})}>
        <input {...getInputProps()} />
        {
          type === QuestionValueType.Image
            ? renderImagePreview()
            : <AddImageBtnContent />
        }
      </div>
      <ImageDialogV2
        open={isOpen}
        initFile={file}
        initData={answer as any}
        upload={upload}
        updateData={updateData}
        setDialog={() => setCloseDialog(true)}
      />
      <ImageCloseDialog
        open={isCloseOpen}
        submit={() => {
          setCloseDialog(false);
          setOpen(false);
        }}
        close={() => setCloseDialog(false)}
      />
    </div>
  )
};

export default QuestionImageDropzone;
