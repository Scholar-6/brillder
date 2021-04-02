import React, { useEffect } from 'react';
import Y from "yjs";
import { Grid } from '@material-ui/core';
import _ from "lodash";

import './Image.scss'
import {fileUrl, uploadFile} from 'components/services/uploadFile';
import ImageDialog from './ImageDialog';
import { ImageAlign } from './model';
import ImageCloseDialog from './ImageCloseDialog';


interface ImageProps {
  locked: boolean;
  index: number;
  data: Y.Map<any>;
  validationRequired: boolean;

  // phone preview
  onFocus(): void;
}

const ImageComponent: React.FC<ImageProps> = ({locked, ...props}) => {
  const [isOpen, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null as File | null);
  const [fileName, setFileName] = React.useState(props.data.get("value").toString());
  const [isCloseOpen, setCloseDialog] = React.useState(false);
  const [invalid, setInvalid] = React.useState(props.validationRequired && !props.data.get("value"));

  useEffect(() => {
    setFileName(props.data.get("value"));
    if (props.data.get("value")) {
      setInvalid(false);
    } else if (props.validationRequired) {
      setInvalid(true);
    }
  }, [props]);

  // observe for incoming changes
  useEffect(() => {
    const observer = _.throttle((evt: any) => {
      const newValue = props.data.get("value");
      //console.log('incoming value ' + newValue);
      //setLevel(newLevel);
      setFileName(newValue);
    }, 200);

    props.data.observe(observer);
    return () => { props.data.unobserve(observer) }
  }, []);

  const updateData = (source: string, caption: string, align: ImageAlign, height: number) => {
    props.data.set("imageSource", source);
    props.data.set("imageCaption", caption);
    props.data.set("imageAlign", align);
    props.data.set("imageHeight", height);
    props.data.set("imagePermision", true);
    setOpen(false);
  }

  const upload = (file: File, source: string, caption: string, align: ImageAlign, height: number) => {
    uploadFile(file, (res: any) => {
      updateData(source, caption, align, height);
      props.data.set("value", res.data.fileName);
      setFileName(props.data.get("value"));
      setOpen(false);
    }, () => { });
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
      <div className={className} onClick={() => {
        if (props.data.get("value")) {
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
        initData={props.data.toJSON()}
        open={isOpen}
        setDialog={() => setCloseDialog(true)}
        initFile={file}
        upload={upload}
        updateData={updateData}
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
  );
}

export default React.memo(ImageComponent);
