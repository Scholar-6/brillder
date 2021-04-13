import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core';

import 'components/build/buildQuestions/components/Image/Image.scss';
import { fileUrl, uploadFile } from 'components/services/uploadFile';
import ImageCloseDialog from 'components/build/buildQuestions/components/Image//ImageCloseDialog';
import ImageCoverDialog from './ImageCoverDialog';
import { ImageCoverData } from './model';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface ImageProps {
  locked: boolean;
  index: number;
  data: ImageCoverData;
  save(comp: ImageCoverData): void;

  // phone preview
  onFocus(): void;
}

const ImageComponent: React.FC<ImageProps> = ({ locked, ...props }) => {
  const [isOpen, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null as File | null);
  const [fileName, setFileName] = React.useState(props.data.value);
  const [isCloseOpen, setCloseDialog] = React.useState(false);
  const [invalid, setInvalid] = React.useState(false);

  useEffect(() => {
    setFileName(props.data.value);
    if (props.data.value) {
      setInvalid(false);
    }
  }, [props]);

  const upload = (file: File, source: string, caption: string) => {
    uploadFile(file, (res: any) => {
      let comp = Object.assign({}, props.data);
      comp.value = res.data.fileName;
      comp.imageSource = source;
      comp.imageCaption = caption;
      comp.imagePermision = true;
      setFileName(comp.value);
      props.save(comp);
      setOpen(false);
    }, () => { });
  }

  const updateData = (source: string, caption: string) => {
    let comp = Object.assign({}, props.data);
    comp.imageSource = source;
    comp.imageCaption = caption;
    comp.imagePermision = true;
    props.save(comp);
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
      <div className={className} onClick={() => {
        if (locked) { return; }
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
            ? <img alt="" style={{ width: '100%' }} src={fileUrl(fileName)} />
            : <SpriteIcon name="image" />
        }
      </div>
      <ImageCoverDialog
        initData={props.data}
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


export default ImageComponent
