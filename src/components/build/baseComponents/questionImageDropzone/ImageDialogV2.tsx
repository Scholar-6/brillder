import React, { useEffect } from "react";

import "./ImageDialogV2.scss";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";
import DropImage from "../../buildQuestions/components/Image/DropImage";
import { fileUrl } from "components/services/uploadFile";
import CopyrightCheckboxes from "components/baseComponents/CopyrightCheckboxs";
import SourceInput from "components/baseComponents/SourceInput";
import QuillEditor from "components/baseComponents/quill/QuillEditor";

interface DialogProps {
  isOption?: boolean; // only pair match
  open: boolean;
  initFile: File | null;
  initData: any;
  fileName: string;
  removeInitFile(): void;
  upload(file: File, source: string, caption: string, permision: boolean | 1): void;
  updateData(source: string, caption: string, permision: boolean | 1): void;
  close(): void;
}

const ImageDialogV2: React.FC<DialogProps> = ({
  isOption,
  open,
  initFile,
  initData,
  fileName,
  removeInitFile,
  upload,
  updateData,
  close,
}) => {
  let initSource = initData.imageSource;
  if (isOption) {
    initSource = initData.imageOptionSource;
  }
  let initCaption = initData.imageCaption;
  if (isOption) {
    initCaption = initData.imageOptionCaption;
  }
  const [source, setSource] = React.useState(initSource || "");
  const [caption, setCaption] = React.useState(initCaption || "");
  const [permision, setPermision] = React.useState(initData.imagePermision ? true : false as boolean | 1);
  const [validationRequired, setValidation] = React.useState(false);
  const [file, setFile] = React.useState(initFile as File | null);
  const [cropedFile, setCroped] = React.useState(file as File | null);
  const [removed, setRemoved] = React.useState(file || fileName ? false : true);

  useEffect(() => {
    if (!file) {
      if (initFile) {
        setFile(initFile);
        setCroped(initFile);
        setRemoved(false);
      }
    }
  }, [initFile, initData.value, file]);


  const validateSource = () => {
    if (source && source.trim().length > 0) {
      return true;
    }
    return false;
  }

  let canUpload = false;
  if ((permision) && validateSource() && !removed) {
    canUpload = true;
  }

  let className = "add-image-button";
  if (!removed) {
    className += " remove-image";
  }

  const handleClick = () => {
    if (!removed) {
      removeInitFile();
      setFile(null);
      setCroped(null);
      setRemoved(true);
    } else {
      let el = document.createElement("input");
      el.setAttribute("type", "file");
      el.setAttribute("accept", ".jpg, .jpeg, .png, .gif");
      el.click();

      el.onchange = () => {
        if (el.files && el.files.length >= 0) {
          setFile(el.files[0]);
          setCroped(el.files[0]);
          setRemoved(false);
        }
      };
    }
  };

  return (
    <BaseDialogWrapper
      open={open}
      className="image-dialog-container image-dialog-v2"
      close={() => { }}
      submit={() => { }}
    >
      <div className="close-button svgOnHover" onClick={close}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="dialog-header image-dialog">
        <div className={`cropping ${removed ? "empty" : ""}`}>
          <div className="centered">
            {removed ? (
              <SpriteIcon name="image" className="icon-image" />
            ) : file ? (
              <DropImage
                initFileName={initData.value}
                locked={false}
                file={file}
                setFile={setCroped}
              />
            ) : (
              <img alt="" src={fileUrl(fileName)} />
            )}
          </div>
          <div className="i-image-footer">
            <div className="file-name">
              {file ? file.name : fileName}
            </div>
            <div className={"svgOnHover " + className} onClick={handleClick}>
              <SpriteIcon name="plus" className="svg-plus active text-white" />
            </div>
          </div>
        </div>
        <div className="bold">
          Where did you get this image?
          <span className="text-theme-orange">*</span>
        </div>
        <SourceInput source={source} validationRequired={validationRequired} setSource={setSource} />
        <CopyrightCheckboxes
          validationRequired={validationRequired}
          permision={permision}
          setPermision={setPermision}
        />
        <QuillEditor
          disabled={false}
          className="quill-caption"
          data={caption}
          showToolbar={true}
          toolbar={['bold', 'italic', 'superscript', 'subscript', 'latex']}
          placeholder="Add caption"
          imageDialog={true}
          onChange={v => setCaption(v)}
        />
      </div>
      <div className="centered last-button">
        <div
          className={`upload-button ${canUpload ? "active" : "disabled"}`}
          onClick={() => {
            if (cropedFile && canUpload) {
              upload(cropedFile, source, caption, permision);
            } else if (canUpload) {
              updateData(source, caption, permision);
            } else {
              setValidation(true);
            }
          }}
        >
          <div className="background" />
          <SpriteIcon name="upload" />
          <div className="css-custom-tooltip bold">Upload</div>
        </div>
      </div>
    </BaseDialogWrapper>
  );
};

export default ImageDialogV2;
