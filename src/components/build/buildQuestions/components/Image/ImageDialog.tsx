import React, { useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { FormControlLabel, Radio } from "@material-ui/core";

import "./ImageDialog.scss";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";
import { ImageAlign, ImageComponentData } from "./model";
import Slider from "@material-ui/core/Slider";
import ImageDesktopPreview from "./ImageDesktopPreview";
import { fileUrl } from "components/services/uploadFile";

interface DialogProps {
  open: boolean;
  initFile: File | null;
  initData: ImageComponentData;
  upload(
    file: File,
    source: string,
    caption: string,
    align: ImageAlign,
    height: number
  ): void;
  updateData(
    source: string,
    caption: string,
    align: ImageAlign,
    height: number
  ): void;
  setDialog(open: boolean): void;
}

const ImageDialog: React.FC<DialogProps> = ({
  open,
  initFile,
  initData,
  upload,
  updateData,
  setDialog,
}) => {
  const [source, setSource] = React.useState(initData.imageSource || "");
  const [caption, setCaption] = React.useState(initData.imageCaption || "");
  const [permision, setPermision] = React.useState(
    initData.imagePermision ? true : false
  );
  const [validationRequired, setValidation] = React.useState(false);
  const [file, setFile] = React.useState(initFile as File | null);
  const [cropedFile, setCroped] = React.useState(file as File | null);
  const [align, setAlign] = React.useState(
    initData.imageAlign ? initData.imageAlign : ImageAlign.center
  );
  const [height, setHeight] = React.useState(
    initData.imageHeight ? initData.imageHeight : 30
  );
  const [removed, setRemoved] = React.useState(null as boolean | null);

  useEffect(() => {
    if (!file) {
      if (initFile) {
        setFile(initFile);
        setCroped(initFile);
      } else if (initData.value) {
        // get image by url
      }
    }
  }, [initFile, file, initData.value]);

  useEffect(() => {
    setHeight(initData.imageHeight);
  }, [initData.imageHeight]);

  // Reset to initial data when dialog opens.
  useEffect(() => {
    if (open) {
      setFile(initFile);
      setCroped(initFile);
      setSource(initData.imageSource ?? "");
      setCaption(initData.imageCaption ?? "");
      setPermision(initData.imagePermision ? true : false);
      setAlign(initData.imageAlign ? initData.imageAlign : ImageAlign.center);
      setHeight(initData.imageHeight ? initData.imageHeight : 30);
    }
    /*eslint-disable-next-line*/
  }, [open]);

  let canUpload = false;
  if (permision && source && !removed) {
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
  };

  const marks = [
    {
      value: 20,
      label: "-",
    },
    {
      value: 50,
      label: "+",
    },
  ];

  return (
    <BaseDialogWrapper
      open={open}
      className="image-dialog-container"
      close={() => setDialog(false)}
      submit={() => {}}
    >
      <div className="close-button svgOnHover" onClick={() => setDialog(false)}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="dialog-header image-dialog">
        <div className={`cropping ${removed ? "empty" : ""}`}>
          <div className="centered">
            {removed ? (
              <SpriteIcon name="image" className="icon-image" />
            ) : (
              <ImageDesktopPreview
                src={fileUrl(initData.value)}
                height={height}
                align={align}
                file={cropedFile}
              />
            )}
          </div>
          <div className="i-image-footer">
            <div className="file-name">
              {file ? file.name : initData.value}
            </div>
            <div className={"svgOnHover " + className} onClick={handleClick}>
              <SpriteIcon name="plus" className="svg-plus active text-white" />
            </div>
          </div>
        </div>
        <div className="flex-inline">
          <span className="bold">Desktop Alignment:</span>
          <FormControlLabel
            checked={align === ImageAlign.center}
            control={<Radio onClick={() => setAlign(ImageAlign.center)} />}
            label="Centre"
          />
          <FormControlLabel
            checked={align === ImageAlign.left}
            control={<Radio onClick={() => setAlign(ImageAlign.left)} />}
            label="Left"
          />
        </div>
        <div className="flex">
          <div className="bold">Image size:</div>
          <Slider
            className="i-s-slider"
            defaultValue={height}
            aria-labelledby="discrete-slider"
            step={1}
            marks={marks} min={20} max={50}
            onChange={(e: any, v: any) => setHeight(v)}
          />
        </div>
        <div className="bold">
          Where did you get this image?
          <span className="text-theme-orange">*</span>
        </div>
        <input
          value={source}
          className={validationRequired && !source ? "invalid" : ""}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Add link to source or name of owner..."
        />
        <div onClick={() => setPermision(!permision)}>
          <Checkbox
            checked={permision}
            className={validationRequired ? "required" : ""}
          />
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
        <div
          className={`upload-button ${canUpload ? "active" : "disabled"}`}
          onClick={() => {
            if (cropedFile && canUpload) {
              upload(cropedFile, source, caption, align, height);
            } else if (canUpload) {
              updateData(source, caption, align, height);
            } else {
              setValidation(true);
            }
          }}
        >
          <SpriteIcon name="upload" />
        </div>
      </div>
    </BaseDialogWrapper>
  );
};

export default ImageDialog;
