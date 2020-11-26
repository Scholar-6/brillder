import React from 'react'
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
// @ts-ignore
import ReactRecord from 'react-record';
import sprite from "assets/img/icons-sprite.svg";
import './Sound.scss';
import Dropzone from './Dropzone';

interface SoundProps {
  locked: boolean;
  index: number;
  data: any;
  save(): void;
  updateComponent(component: any, index: number): void;
}

export enum AudioStatus {
  Start,
  Recording,
  Recorded,
  Play,
  Stop,
}

const SoundComponent: React.FC<SoundProps> = ({ locked, ...props }) => {
  let initAudio = new Audio();
  let initStatus = AudioStatus.Start;
  if (props.data && props.data.value) {
    initAudio = new Audio(`${process.env.REACT_APP_BACKEND_HOST}/files/${props.data.value}`)
    initStatus = AudioStatus.Recorded;
  }
  const [status, setStatus] = React.useState(initStatus as AudioStatus);
  const [blobUrl, setBlobUrl] = React.useState("");
  const [audio, setAudio] = React.useState(initAudio);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'audio/*',
    disabled: locked,
    onDrop: (files: any[]) => {
      if (files && files.length > 0) {
        saveAudio(files[0]);
      }
    }
  });

  const files = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  /* Recording audios */
  const recordFile = (blob: Blob) => {
    if (locked) { return; }
  }

  const onSave = (blob: any) => {
    if (locked) { return; }
    saveAudio(blob.blob);
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
    audio.onended = function () {
      setStatus(AudioStatus.Recorded);
    };
  }

  const stopRecord = () => {
    audio.pause();
    setStatus(AudioStatus.Recorded);
  }

  const saveAudio = (file: any) => {
    if (file) {
      var formData = new FormData();
      formData.append('file', file);
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
        props.save();
      })
        .catch(error => {
          alert('Can`t save audio file');
        });
    }
  }

  const deleteAudio = () => {
    if (locked) { return; }
    setStatus(AudioStatus.Start);
    setBlobUrl("");
  }
  /* Recording audios */

  let canDelete = status === AudioStatus.Start || status === AudioStatus.Recording;

  return (
    <div className="react-recording">
      <Dropzone locked={locked} status={status} saveAudio={saveAudio} />
      <div className="record-button-row">
        <ReactRecord
          record={status === AudioStatus.Recording}
          onStop={onStop}
          onSave={onSave}
          onData={recordFile}
        >
          {
            (status === AudioStatus.Start && !blobUrl) ?
              <button className="btn start-record svgOnHover"
                onClick={() => startRecording()}>
                <svg className="svg active">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#circle-filled"} className="text-theme-orange" />
                </svg>
                <span>Record</span>
              </button>
              : ''
          }
          {
            (status === AudioStatus.Recording) ?
              <button className="btn stop-record svgOnHover"
                onClick={stopRecording}>
                <svg className="svg active">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#circle-filled"} className="text-white" />
                </svg>
                <span>Recording</span>
              </button>
              : ''
          }
          {
            (status === AudioStatus.Recorded) ?
              <button className="btn svgOnHover play-record"
                onClick={playRecord}>
                <svg className="svg active">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#play-filled"} className="text-theme-orange" />
                </svg>
                <span>Play</span>
              </button>
              : ''
          }
          {
            (status === AudioStatus.Play) ?
              <button className="btn svgOnHover play-record"
                onClick={stopRecord}>
                <svg className="svg active">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#pause-filled"} className="text-theme-orange" />
                </svg>
                <span>Pause</span>
              </button>
              : ''
          }
          <button className={"btn delete-record " + (canDelete ? 'disabled' : "")}
            onClick={() => deleteAudio()}
            disabled={canDelete}>
            <span>Delete</span>
          </button>
        </ReactRecord>
      </div>
    </div>
  );
}

export default SoundComponent
