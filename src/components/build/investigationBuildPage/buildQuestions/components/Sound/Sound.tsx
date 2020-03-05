import React from 'react'
import {useDropzone} from 'react-dropzone';

import './Sound.scss';
import { Grid } from '@material-ui/core';

interface SoundProps {
  locked: boolean
}

const SoundComponent: React.FC<SoundProps> = ({locked}) => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'audio/*',
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
        <Grid container justify="center" alignContent="center" style={{height:'80%'}}>
          <p>Drag Sound File Here | Click to Select Sound File</p>
        </Grid>
        
      </div>
      {files[0]}
    </div>
  );
}


export default SoundComponent
