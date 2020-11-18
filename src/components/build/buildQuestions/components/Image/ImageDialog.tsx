import React from "react";
import Checkbox from "@material-ui/core/Checkbox";

import './ImageDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";
import DropImage from "./DropImage";
import { ImageComponentData } from "./model";

interface DialogProps {
  open: boolean;
  initData: ImageComponentData;
  upload(file: File, source: string, caption: string): void;
  setDialog(open: boolean): void;
}

const ImageDialog: React.FC<DialogProps> = ({ open, initData, upload, setDialog }) => {
  const [source, setSource] = React.useState(initData.imageSource || '');
  const [caption, setCaption] = React.useState(initData.imageCaption || '');
  const [permision, setPermision] = React.useState(false);
  const [validationRequired, setValidation] = React.useState(false);

  const [file, setFile] = React.useState(null as File | null);

  let canUpload = false;
  if (permision && source && file) {
    canUpload = true;
  }

  return (
    <BaseDialogWrapper open={open} close={() => setDialog(false)} submit={() => {}}>
      <div className="dialog-header image-dialog">
        <DropImage initFileName="" locked={false} setFile={setFile} />
        <div className="bold">Where did you get this image?</div>
        <input
          value={source}
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
        <div className="centered">
          <SpriteIcon name="upload" className={`upload-button ${canUpload ? 'active' : 'disabled'}`} onClick={() => {
            if (file && canUpload) {
              upload(file, source, caption);
            } else {
              setValidation(true);
            }
           }} />
        </div>
      </div>
    </BaseDialogWrapper>
  );
}

export default ImageDialog;
