import React from 'react'
import {useDropzone} from 'react-dropzone';

import './Image.scss'
import { Grid } from '@material-ui/core';

const ImageComponent: React.FC<any> = () => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png'
  });
  
  const files = acceptedFiles.map((file:any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <Grid container justify="center" alignContent="center" style={{height:'100%'}}>
          <p>Drag 'n' drop some files here, or click to select files</p>
        </Grid>
      </div>
      {files}
    </div>
  );
}


export default ImageComponent
