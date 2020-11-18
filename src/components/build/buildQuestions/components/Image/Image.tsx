import React from 'react'
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
  const [fileName, setFileName] = React.useState(props.data.value);

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
      <div className={'dropzone ' + (locked ? 'disabled' : '')} onClick={() => setOpen(true)}>
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
      <ImageDialog open={isOpen} setDialog={setOpen} upload={upload} />
    </div>
  );
}


export default ImageComponent
