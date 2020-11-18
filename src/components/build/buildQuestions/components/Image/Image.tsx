import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core';

import './Image.scss'
import {uploadFile} from 'components/services/uploadFile';
import ImageDialog from './ImageDialog';
import { ImageComponentData } from './model';


interface ImageProps {
  locked: boolean;
  index: number;
  data: ImageComponentData;
  save(): void;
  updateComponent(component:any, index:number): void;
}

const ImageComponent: React.FC<ImageProps> = ({locked, ...props}) => {
  const [isOpen, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null as File | null);
  const [fileName, setFileName] = React.useState(props.data.value);

  useEffect(() => {
    setFileName(props.data.value);
  }, [props]);

  const upload = (file: File, source: string, caption: string) => {
    uploadFile(file, (res: any) => {
      let comp = Object.assign({}, props.data);
      comp.value = res.data.fileName;
      comp.imageSource = source;
      comp.imageCaption = caption;
      props.updateComponent(comp, props.index);
      setFileName(comp.value);
      props.save();
      setOpen(false);
      console.log(comp);
    }, () => { });
  }

  return (
    <div className="image-drag-n-drop">
      <div className={'dropzone ' + (locked ? 'disabled' : '')} onClick={() => {
        let el = document.createElement("input");
        el.setAttribute("type", "file");
        el.setAttribute("accept", ".jpg, .jpeg, .png");
        el.click();

        el.onchange = (files: any) => {
          if (el.files && el.files.length >= 0) {
            setFile(el.files[0]);
            setOpen(true);
          }
        };
      }}>
        {
          fileName
            ? <img alt="" style={{width: '100%'}} src={`${process.env.REACT_APP_BACKEND_HOST}/files/${fileName}`} />
            : <Grid
                container
                justify="center"
                alignContent="center"
                direction="row"
                style={{height: '10vh'}}
              >
                Click to Select Image
              </Grid>
        }
      </div>
      {file &&
        <ImageDialog
          open={isOpen}
          setDialog={setOpen}
  
          initData={props.data}
          upload={upload}
  
          file={file}
        />
      }
    </div>
  );
}


export default ImageComponent
