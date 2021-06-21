import React, { useState } from "react";

import './QuestionImageDropzone.scss';
import {fileUrl, uploadFile} from 'components/services/uploadFile';
import { QuestionValueType } from "../../buildQuestions/questionTypes/types";
import AddImageBtnContent from "../AddImageBtnContent";
import ImageDialogV2 from "./ImageDialogV2";
import { MainImageProps } from "components/build/buildQuestions/components/Image/model";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";

export interface ImageAnswerData extends MainImageProps {
  value: string;
  valueFile: string;
  answerType: QuestionValueType;
  imageOptionSource: string; // only for pairMatch
  imageOptionCaption: string; // only for pairMatch
}

export interface AnswerProps {
  isOption?: boolean; // only for pair match
  answer: ImageAnswerData;
  locked: boolean;
  className?: string;
  type: QuestionValueType;
  fileName: string;
  update(fileName: string): void;
}

const QuestionImageDropzone: React.FC<AnswerProps> = ({
  locked, answer, fileName, type, className, isOption, update
}) => {
  const [imageInvalid, setInvalid] = useState(false);
  const [file, setFile] = useState(null as File | null);
  const [isOpen, setOpen] = useState(false);

  const updateAnswer = (fileName: string, source: string, caption: string, permision: boolean) => {
    if (locked) { return; }
    if (isOption) {
      answer.imageOptionSource = source;
      answer.imageOptionCaption = caption;
    } else {
      answer.imageSource = source;
      answer.imageCaption = caption;
    }
    answer.imagePermision = permision;
    update(fileName);
    setOpen(false);
  }

  const removeInitFile = () => setFile(null);

  const upload = (file: File, source: string, caption: string, permision: boolean) => {
    if (locked) { return; }
    return uploadFile(file, (res: any) => {
      updateAnswer(res.data.fileName, source, caption, permision);
    }, (e: any) => {
      setInvalid(true);
    });
  }

  const updateData = (source: string, caption: string, permision: boolean) => {
    updateAnswer(answer.valueFile, source, caption, permision);
  }

  const renderCaption = () => {
    if (type === QuestionValueType.Image && answer.imageCaption) {
      if (isOption) {
        return answer.imageOptionCaption;
      }
      return answer.imageCaption;
    }
    return '';
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
      <div className="build-image-caption">
        {renderCaption()}
      </div>
      <ImageDialogV2
        open={isOpen}
        initFile={file}
        fileName={fileName}
        isOption={isOption}
        initData={answer as any}
        upload={upload}
        updateData={updateData}
        removeInitFile={removeInitFile}
        close={() => setOpen(false)}
      />
      <ValidationFailedDialog
        isOpen={imageInvalid} close={() => setInvalid(false)}
        header="This image is too large, try shrinking it."
      />
    </div>
  )
};

export default QuestionImageDropzone;
