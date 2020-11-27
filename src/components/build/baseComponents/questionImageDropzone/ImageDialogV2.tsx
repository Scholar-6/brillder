import React, { useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";
import DropImage from "../../buildQuestions/components/Image/DropImage";
import { ImageComponentData } from "../../buildQuestions/components/Image/model";

interface DialogProps {
  open: boolean;
  initFile: File | null;
  initData: ImageComponentData;
  upload(file: File, source: string, caption: string): void;
  updateData(source: string, caption: string): void;
  setDialog(open: boolean): void;
}

const ImageDialogV2: React.FC<DialogProps> = ({ open, initFile, initData, upload, updateData, setDialog }) => {
  const [source, setSource] = React.useState(initData.imageSource || '');
  const [caption, setCaption] = React.useState(initData.imageCaption || '');
  const [permision, setPermision] = React.useState(initData.imagePermision ? true : false);
  const [validationRequired, setValidation] = React.useState(false);
  const [file, setFile] = React.useState(initFile as File | null);
  const [cropedFile, setCroped] = React.useState(file as File | null);
  const [removed, setRemoved] = React.useState(null as boolean | null);

  useEffect(() => {
    if (!file) {
      if (initFile) {
        setFile(initFile);
        setCroped(initFile);
      }
    }
  }, [initFile, initData.value]);

  let canUpload = false;
  if (permision && source && !removed) {
    canUpload = true;
  }

  let className = "add-image-button"
  if (!removed) {
    className += " remove-image"
  }

  const handleClick= () => {
    if (!removed) {
      setFile(null);
      setCroped(null);
      setRemoved(true);
    } else {
      let el = document.createElement("input");
      el.setAttribute("type", "file");
      el.setAttribute("accept", ".jpg, .jpeg, .png");
      el.click();

      el.onchange = () => {
        if (el.files && el.files.length >= 0) {
          setFile(el.files[0]);
          setCroped(el.files[0]);
          setRemoved(false);
        }
      };
    }
  }

  return (
    <BaseDialogWrapper open={open} className="image-dialog-container" close={() => setDialog(false)} submit={() => {}}>
      <div className="dialog-header image-dialog">
        <div className={`cropping ${removed ? 'empty' : ''}`}>
          <div className="switch-image">
            <div className={"svgOnHover " + className} onClick={handleClick}>
              <SpriteIcon name="plus" className="svg-plus active text-white" />
            </div>
          </div>
          <div className="centered">
            {removed
              ? <SpriteIcon name="image" className="icon-image" />
              : <DropImage initFileName={initData.value} locked={false} file={file} setFile={setCroped} />
            }
          </div>
        </div>
        <div className="bold">
          Where did you get this image?
          <span className="text-theme-orange">*</span>
        </div>
        <input
          value={source}
          className={validationRequired && !source ? 'invalid' : ''}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Add link to source or name of owner..."
        />
        <div onClick={() => setPermision(!permision)}>
          <Checkbox checked={permision} className={validationRequired ? 'required' : ''} />
          I have permision to distribute this image
          <span className="text-theme-orange">*</span>
        </div>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add caption..."
        />
      </div>
      <div className="centered last-button">
        <SpriteIcon name="upload" className={`upload-button ${canUpload ? 'active' : 'disabled'}`} onClick={() => {
          if (cropedFile && canUpload) {
            upload(cropedFile, source, caption);
          } else if (canUpload) {
            updateData(source, caption);
          } else {
            setValidation(true);
          }
         }} />
      </div>
    </BaseDialogWrapper>
  );
}

export default ImageDialogV2;
