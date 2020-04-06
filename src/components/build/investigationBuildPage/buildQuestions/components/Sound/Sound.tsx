import React from 'react'
import {useDropzone} from 'react-dropzone';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import axios from 'axios';
// @ts-ignore
import ReactRecord from 'react-record';

import './Sound.scss';
import { Grid, Button } from '@material-ui/core';

interface SoundProps {
  locked: boolean
  index: number,
  data: any,
  updateComponent(component:any, index:number): void
}

enum AudioStatus {
  Start,
  Recording,
  Recorded,
  Play,
  Stop
}

const SoundComponent: React.FC<SoundProps> = ({locked, ...props}) => {
  const [status, setStatus] = React.useState(AudioStatus.Start);
  const [blobUrl, setBlobUrl] = React.useState("");
  const [audio, setAudio] = React.useState(new Audio());
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'audio/*',
    disabled: locked
  });
  
  const files = acceptedFiles.map((file:any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  /* Recording audios */
  const recordFile = (blob: Blob) => {
    if (locked) { return; }
    console.log('Record: ', blob);
  }

  const onSave = (blob: any) => {
    if (locked) { return; }
    saveAudio(blob);
  }

  const onStop = (blob: any) => {
    if (locked) { return; }
    setBlobUrl(blob.blobURL);
    setAudio(new Audio(blob.blobURL));
  }

  const startRecording = () => {
    if (locked) { return; }
    return status === AudioStatus.Start ? setStatus(AudioStatus.Recording) : null;
  }

  const stopRecording = () => {
    if (locked) { return; }
    return status === AudioStatus.Recording ? setStatus(AudioStatus.Recorded) : null;
  }

  const playRecord = () => {
    audio.play();
    setStatus(AudioStatus.Play);
    audio.onpause = function () {
      //console.log(pause);
    }
  }

  function dataURItoBlob(dataURI: string) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  const saveAudio = (result: any) => {
    if (result) {
      var formData = new FormData();
      formData.append('file', result.blob);
      return axios.post(
        process.env.REACT_APP_BACKEND_HOST + '/fileUpload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      ).then(res => {
        let comp = Object.assign({}, props.data);
        comp.value = res.data.fileName;
        props.updateComponent(comp, props.index);
      })
      .catch(error => {
        alert('Can`t save image');
      });
    }
  }

  const deleteAudio = () => {
    if (locked) { return; }
    setStatus(AudioStatus.Start);
    setBlobUrl("");
  }
  /* Recording audios */

  return (
    <div className="react-recording">
      {
        (status === AudioStatus.Start) ?
          <div>
            <div {...getRootProps({className: 'dropzone ' + ((locked) ? 'disabled' : '')})}>
              <input {...getInputProps()} />
              <Grid container justify="center" alignContent="center" style={{height:'80%'}}>
                <p>Drag Sound File Here | Click to Select Sound File</p>
              </Grid>
            </div>
            {files[0]}
          </div>
        : <div></div>
      }
      <Grid container item xs={12} justify="center">
      <ReactRecord
        record={status === AudioStatus.Recording}
        onStop={onStop}
        onSave={onSave}
        onData={recordFile}
      >
        {
          (status === AudioStatus.Start && !blobUrl) ?
            <Button className="start-record" onClick={startRecording} type="button">
              <div className="round-circle"></div> Record
            </Button>
          : <div></div>
        }
        {
          (status === AudioStatus.Recording) ?
            <Button className="stop-record" onClick={stopRecording} type="button">
             <div className="round-circle"></div>  Recording
            </Button>
          : <div></div>
        }
        {
          blobUrl ?
            <Button className="play-record" onClick={playRecord} type="button">
              <PlayArrowIcon className="play-arrow" /> Play
            </Button>
         : <div></div>
        }
        <Button
          className={"delete-record " + (!blobUrl ? 'disabled' : "")}
          onClick={() => deleteAudio()}
          disabled={!blobUrl}
        >
          Delete
        </Button>
      </ReactRecord>
      </Grid>
    </div>
  );
}


export default SoundComponent
