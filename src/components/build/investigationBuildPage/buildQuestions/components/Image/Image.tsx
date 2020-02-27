import React from 'react'
import {useDropzone} from 'react-dropzone';

import './Image.scss'
import { Grid } from '@material-ui/core';

interface ImageProps {
  locked: boolean
}

const ImageComponent: React.FC<ImageProps> = ({locked}) => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    disabled: locked
  });
  
  const files = acceptedFiles.map((file:any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div>
      <div {...getRootProps({className: 'dropzone ' + ((locked) ? 'disabled' : '')})}>
        <input {...getInputProps()} />
        <Grid container justify="center" alignContent="center" style={{height:'100%'}}>
          <p>Drag 'n' drop image here, or click to select image</p>
        </Grid>
      </div>
      {files[0]}
    </div>
  );
}


export default ImageComponent
