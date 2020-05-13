import React from 'react'
import {useDropzone} from 'react-dropzone';
import { Grid } from '@material-ui/core';

import './Image.scss'
import {uploadFile} from 'components/services/uploadFile';


interface ImageProps {
  locked: boolean,
  index: number,
  data: any,
  updateComponent(component:any, index:number): void
}

const ImageComponent: React.FC<ImageProps> = ({locked, ...props}) => {
  const [fileName, setFileName] = React.useState(props.data.value);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    disabled: locked,
    onDrop: (files:any[]) => {
      return uploadFile(files[0] as File, (res: any) => {
        let comp = Object.assign({}, props.data);
        comp.value = res.data.fileName;
        props.updateComponent(comp, props.index);
        setFileName(comp.value);
      }, () => { });
    }
  });

  return (
    <div className="image-drag-n-drop">
      <div {...getRootProps({className: 'dropzone ' + ((locked) ? 'disabled' : '')})}>
        <input {...getInputProps()} />
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
                Drag Image Here | Click to Select Image
              </Grid>
        }
      </div>
    </div>
  );
}


export default ImageComponent
