import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { FormControlLabel, Radio } from "@material-ui/core";

import './ImageDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";
import DropImage from "./DropImage";
import { ImageAlign, ImageComponentData } from "./model";
import Slider from '@material-ui/core/Slider';

interface DialogProps {
  open: boolean;
  initFile: File;
  initData: ImageComponentData;
  upload(file: File, source: string, caption: string, align: ImageAlign, height: number): void;
  setDialog(open: boolean): void;
}

const ImageDialog: React.FC<DialogProps> = ({ open, initFile, initData, upload, setDialog }) => {
  const [source, setSource] = React.useState(initData.imageSource || '');
  const [caption, setCaption] = React.useState(initData.imageCaption || '');
  const [permision, setPermision] = React.useState(false);
  const [validationRequired, setValidation] = React.useState(false);
  const [file, setFile] = React.useState(initFile as File | null);
  const [cropedFile, setCroped] = React.useState(file as File | null);
  const [align, setAlign] = React.useState(ImageAlign.left);
  const [height, setHeight] = React.useState(0 as number);

  let canUpload = false;
  if (permision && source && cropedFile) {
    canUpload = true;
  }

  let className = "add-image-button"
  if (file) {
    className += " remove-image"
  }

  const handleClick= () => {
    if (file) {
      setFile(null);
      setCroped(null);
    } else {
      let el = document.createElement("input");
      el.setAttribute("type", "file");
      el.setAttribute("accept", ".jpg, .jpeg, .png");
      el.click();

      el.onchange = (files: any) => {
        if (el.files && el.files.length >= 0) {
          setFile(el.files[0]);
        }
      };
    }
  }

  const marks = [{
      value: 20,
      label: '20%',
    },
    {
      value: 50,
      label: '50%',
    },
  ];

  function valuetext(value: number) {
    return `${value}%`;
  }

  return (
    <BaseDialogWrapper open={open} close={() => setDialog(false)} submit={() => {}}>
      <div className="dialog-header image-dialog">
        <div className="switch-image">
          <div className={"svgOnHover " + className} onClick={handleClick}>
            <SpriteIcon name="plus" className="svg-plus active text-white" />
          </div>
        </div>
        {file && <DropImage initFileName="" locked={false} file={file} setFile={setCroped} />}
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
        <div>Align</div>
        <div>
          <FormControlLabel
            checked={align === ImageAlign.left}
            control={<Radio onClick={() => setAlign(ImageAlign.left)} />}
            label="Left" />
          <FormControlLabel
            checked={align === ImageAlign.center}
            control={<Radio onClick={() => setAlign(ImageAlign.center)} />}
            label="Center" />
        </div>
        <div>Image size</div>
        <Slider
          defaultValue={30}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          min={20}
          max={50}
          onChange={(e:any, v:any) => setHeight(v)}
        />
        <div className="centered">
          <SpriteIcon name="upload" className={`upload-button ${canUpload ? 'active' : 'disabled'}`} onClick={() => {
            if (cropedFile && canUpload) {
              upload(cropedFile, source, caption, align, height);
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
