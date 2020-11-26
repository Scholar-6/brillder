import React from 'react'
import axios from 'axios';
// @ts-ignore
import ReactRecord from 'react-record';
import sprite from "assets/img/icons-sprite.svg";
import './Sound.scss';
import Dropzone from './Dropzone';
import PauseButton from './components/PauseButton';
import PlayButton from './components/PlayButton';
import RecordingButton from './components/RecordingButton';
import RecordButton from './components/RecordButton';
import { uploadFile } from 'components/services/uploadFile';

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

  /* Recording audios */
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
      uploadFile(file, (res: any) => {
        let comp = Object.assign({}, props.data);
        comp.value = res.data.fileName;
        props.updateComponent(comp, props.index);
        props.save();
      }, () => {
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
        >
          <RecordButton status={status} blobUrl={blobUrl} onClick={startRecording} />
          <RecordingButton status={status} onClick={stopRecording} />
          <PlayButton status={status} onClick={playRecord} />
          <PauseButton status={status} onClick={stopRecord} />
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
