import React, { useEffect } from "react";

import './ImageDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";
import DropImage from "components/build/buildQuestions/components/Image/DropImage";
import CopyrightCheckboxes from "components/baseComponents/CopyrightCheckboxs";


interface DialogProps {
  open: boolean;
  initFile: File | null;
  initValue: string;
  upload(file: File, sponsorName: string, sponsorUrl: string): void;
  setDialog(open: boolean): void;
}

const ImageSponsorDialog: React.FC<DialogProps> = ({ open, initFile, initValue, upload, setDialog }) => {
  const [permision, setPermision] = React.useState(false as boolean | 1);
  const [validationRequired, setValidation] = React.useState(false);
  const [file, setFile] = React.useState(initFile as File | null);
  const [cropedFile, setCroped] = React.useState(file as File | null);
  const [removed, setRemoved] = React.useState(null as boolean | null);
  const [sponsorName, setSponsorName] = React.useState('');
  const [sponsorUrl, setSponsorUrl] = React.useState('');

  useEffect(() => {
    if (!file) {
      if (initFile) {
        setFile(initFile);
        setCroped(initFile);
      } else if (initValue) {
        // get image by url
      }
    }
  }, [initFile, file, initValue]);

  let canUpload = false;
  if (permision && !removed) {
    canUpload = true;
  }

  let className = "add-image-button";
  if (!removed) {
    className += " remove-image";
  }

  const handleClick = () => {
    if (!removed) {
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
  }

  return (
    <BaseDialogWrapper open={open} className="image-dialog-container" close={() => setDialog(false)} submit={() => { }}>
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
              : <DropImage initFileName={initValue} locked={false} file={file} setFile={setCroped} />
            }
          </div>
        </div>
        <div className="source-input">
          <div className="fixed-icon">
            <SpriteIcon name="link" />
          </div>
          <input
            value={sponsorName}
            onChange={(e) => setSponsorName(e.target.value)}
            placeholder="Add sponsors name"
          />
        </div>
        <div className="source-input">
          <div className="fixed-icon">
            <SpriteIcon name="link" />
          </div>
          <input
            value={sponsorUrl}
            onChange={(e) => setSponsorUrl(e.target.value)}
            placeholder="Add link to sponsors page"
          />
        </div>
        <CopyrightCheckboxes
          validationRequired={validationRequired}
          permision={permision}
          setPermision={setPermision}
        />
      </div>
      <div className="centered last-button">
        <div className={`upload-button ${canUpload ? 'active' : 'disabled'}`} onClick={() => {
          if (cropedFile && canUpload) {
            upload(cropedFile, sponsorName, sponsorUrl);
          } else {
            setValidation(true);
          }
        }}>
          <SpriteIcon name="upload" />
        </div>
      </div>
    </BaseDialogWrapper>
  );
}

export default ImageSponsorDialog;
