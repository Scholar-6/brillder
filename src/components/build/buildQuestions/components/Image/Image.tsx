import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';

import './Image.scss'
import {fileUrl, uploadFile} from 'components/services/uploadFile';
import ImageDialog from './ImageDialog';
import { ImageAlign, ImageComponentData } from './model';
import ValidationFailedDialog from 'components/baseComponents/dialogs/ValidationFailedDialog';


interface ImageProps {
  locked: boolean;
  index: number;
  data: ImageComponentData;
  validationRequired: boolean;
  save(): void;
  updateComponent(component:any, index:number): void;

  // phone preview
  onFocus(): void;
}

const ImageComponent: React.FC<ImageProps> = ({locked, ...props}) => {
  const [isOpen, setOpen] = useState(false);
  const [imageInvalid, setImageInvalid] = useState(false);
  const [file, setFile] = useState(null as File | null);
  const [fileName, setFileName] = useState(props.data.value);
  const [invalid, setInvalid] = useState(props.validationRequired && !props.data.value);

  useEffect(() => {
    setFileName(props.data.value);
    if (props.data.value) {
      setInvalid(false);
    } else if (props.validationRequired) {
      setInvalid(true);
    }
  }, [props]);

  const upload = (file: File, source: string, caption: string, align: ImageAlign, height: number) => {
    uploadFile(file, (res: any) => {
      let comp = Object.assign({}, props.data);
      comp.value = res.data.fileName;
      comp.imageSource = source;
      comp.imageCaption = caption;
      comp.imageAlign= align;
      comp.imageHeight = height;
      comp.imagePermision = true;
      props.updateComponent(comp, props.index);
      setFileName(comp.value);
      props.save();
      setOpen(false);
    }, () => {
      setImageInvalid(true);
    });
  }

  const updateData = (source: string, caption: string, align: ImageAlign, height: number) => {
    let comp = Object.assign({}, props.data);
    comp.imageSource = source;
    comp.imageCaption = caption;
    comp.imageAlign= align;
    comp.imageHeight = height;
    comp.imagePermision = true;
    props.updateComponent(comp, props.index);
    props.save();
    setOpen(false);
  }

  let className = 'dropzone';
  if (locked) {
    className += ' disabled';
  }

  if (invalid) {
    className += ' invalid';
  }

  return (
    <div className="image-drag-n-drop" onClick={props.onFocus}>
      <div className="text-label-container">
        Image
      </div>
      <div className={className} onClick={() => {
        if (props.data.value) {
          setOpen(true);
        } else {
          let el = document.createElement("input");
          el.setAttribute("type", "file");
          el.setAttribute("accept", ".jpg, .jpeg, .png, .gif");
          el.click();
  
          el.onchange = () => {
            if (el.files && el.files.length >= 0) {
              setFile(el.files[0]);
              setOpen(true);
            }
          };
        }
      }}>
        {
          fileName
            ? <img alt="" style={{width: '100%'}} src={fileUrl(fileName)} />
            : <Grid
                container
                justify="center"
                alignContent="center"
                direction="row"
                style={{height: '10vh'}}
              >
                Click to Select Image (jpg, png or gif)
              </Grid>
        }
      </div>
      <ImageDialog
        initData={props.data}
        open={isOpen}
        setDialog={() => setOpen(false)}
        initFile={file}
        upload={upload}
        updateData={updateData}
      />
      <ValidationFailedDialog
        isOpen={imageInvalid} close={() => setImageInvalid(false)}
        header="This image is too large, try shrinking it."
      />
    </div>
  );
}


export default ImageComponent
