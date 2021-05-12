import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import './QuestionImageDropzone.scss';
import {fileUrl, uploadFile} from 'components/services/uploadFile';
import { QuestionValueType } from "../../buildQuestions/questionTypes/types";
import AddImageBtnContent from "../AddImageBtnContent";
import ImageDialogV2 from "./ImageDialogV2";
import { MainImageProps } from "components/build/buildQuestions/components/Image/model";

export interface ImageAnswerData extends MainImageProps {
  value: string;
  valueFile: string;
  answerType: QuestionValueType;
}

export interface AnswerProps {
  answer: ImageAnswerData;
  locked: boolean;
  className?: string;
  type: QuestionValueType;
  fileName: string;
  update(fileName: string): void;
}

const QuestionImageDropzone: React.FC<AnswerProps> = ({
  locked, answer, fileName, type, className, update
}) => {
  const [file, setFile] = useState(null as File | null);
  const [isOpen, setOpen] = useState(false);

  const updateAnswer = (fileName: string, source: string, caption: string, permision: boolean) => {
    if (locked) { return; }
    answer.imageSource = source;
    answer.imageCaption = caption;
    answer.imagePermision = permision;
    update(fileName);
    setOpen(false);
  }

  const removeInitFile = () => setFile(null);

  const upload = (file: File, source: string, caption: string, permision: boolean) => {
    if (locked) { return; }
    return uploadFile(file, (res: any) => {
      updateAnswer(res.data.fileName, source, caption, permision);
    }, () => { });
  }

  const updateData = (source: string, caption: string, permision: boolean) => {
    updateAnswer(answer.valueFile, source, caption, permision);
  }

  return (
    <div className={`question-image-drop ${className ? className : ''}`}>
      <div
        className={'dropzone ' + (locked ? 'disabled' : '')}
        onClick={e => {
          if (type === QuestionValueType.Image) {
            setOpen(true)
          } else {
            let el = document.createElement("input");
            el.setAttribute("type", "file");
            el.setAttribute("accept", ".jpg, .jpeg, .png, .gif");
            el.onchange = () => {
              if (el.files && el.files.length >= 0) {
                setFile(el.files[0] as File);
                setOpen(true);
              }
            };
            el.click();
          }
        }}
      >
        {
          type === QuestionValueType.Image
            ? <img src={fileUrl(fileName)} alt="" width="100%" height="auto"/>
            : <AddImageBtnContent />
        }
      </div>
      <div className="build-image-caption">{(answer.answerType === QuestionValueType.Image && answer.imageCaption) ? answer.imageCaption : ''}</div>
      <ImageDialogV2
        open={isOpen}
        initFile={file}
        fileName={fileName}
        initData={answer as any}
        upload={upload}
        updateData={updateData}
        removeInitFile={removeInitFile}
        close={() => setOpen(false)}
      />
    </div>
  )
};

export default QuestionImageDropzone;
