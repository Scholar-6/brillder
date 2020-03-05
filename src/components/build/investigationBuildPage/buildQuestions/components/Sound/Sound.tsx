import React from 'react'
import {useDropzone} from 'react-dropzone';
// @ts-ignore
import Recorder from 'react-mp3-recorder'

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

  const onStop = (blob:any) => {
    console.log(blob);
  }

  const onRecordingComplete = (blob:any) => {
    console.log('recording', blob)
  }
 
  const onRecordingError = (err:any) => {
    console.log('recording error', err)
  }

  return (
    <div>
      <div {...getRootProps({className: 'dropzone ' + ((locked) ? 'disabled' : '')})}>
        <input {...getInputProps()} />
        <Grid container justify="center" alignContent="center" style={{height:'80%'}}>
          <p>Drag Sound File Here | Click to Select Sound File</p>
        </Grid>
        
      </div>
      {files[0]}
      <Grid container justify="center" alignContent="center" style={{height:'20%'}}>
          <Recorder onRecordingComplete={onRecordingComplete} onRecordingError={onRecordingError} />
        </Grid>
    </div>
  );
}


export default SoundComponent
