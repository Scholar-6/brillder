import React from "react";
import { fileUrl, uploadFile } from "components/services/uploadFile";
import Dropzone from "../../components/Sound/Dropzone";
import Recording from "./Recording";
import RecordButton from "../../components/Sound/components/buttons/RecordButton";
import RecordingButton from "../../components/Sound/components/buttons/RecordingButton";
import PlayButton from "../../components/Sound/components/buttons/PlayButton";
import PauseButton from "../../components/Sound/components/buttons/PauseButton";

interface SoundProps {
  locked: boolean;
  index: number;
  data: any;
  save(): void;
  updateComponent(component: any, index: number): void;
}

interface SoundState {
  status: AudioStatus;
  blobUrl: string;
  audio: HTMLAudioElement;
}

export enum AudioStatus {
  Start,
  Recording,
  BeforeRecorded,
  Recorded,
  Play,
  Stop,
}

class SoundComponent extends React.Component<SoundProps, SoundState> {
  constructor(props: SoundProps) {
    super(props);

    let initAudio = new Audio();
    let initStatus = AudioStatus.Start;
    if (props.data && props.data.value) {
      initAudio = new Audio(fileUrl(props.data.value));
      initStatus = AudioStatus.Recorded;
    }

    this.state = {
      status: initStatus,
      blobUrl: "",
      audio: initAudio,
    };
  }

  onSave(blob: any) {
    if (this.props.locked) {
      return;
    }
    this.saveAudio(blob.blob);
  }

  onStop(blob: any) {
    if (this.props.locked) {
      return;
    }
    this.setState({ blobUrl: blob.blobURL, audio: new Audio(blob.blobURL) });
  }

  startRecording() {
    if (this.props.locked) {
      return;
    }
    if (this.state.status === AudioStatus.Start) {
      this.setState({ status: AudioStatus.Recording });
    }
  }

  stopRecord() {
    this.state.audio.pause();
    this.setRecorded();
  }

  stopRecording() {
    if (this.props.locked) {
      return;
    }
    if (this.state.status === AudioStatus.Recording) {
      this.setState({ status: AudioStatus.BeforeRecorded });
    }
  }

  setRecorded() {
    this.setState({ status: AudioStatus.Recorded });
  }

  playRecord() {
    const {audio} = this.state;
    audio.play();
    this.setState({ status: AudioStatus.Play });
    audio.onended = this.setRecorded.bind(this);
  }

  deleteAudio() {
    if (this.props.locked) {
      return;
    }
    this.setState({ blobUrl: "", status: AudioStatus.Start });
  }

  saveAudio(file: any) {
    if (file) {
      uploadFile(
        file,
        (res: any) => {
          let comp = Object.assign({}, this.props.data);
          comp.value = res.data.fileName;
          this.setRecorded();
          this.props.updateComponent(comp, this.props.index);
          this.props.save();
        },
        () => {
          alert("Can`t save audio file");
        }
      );
    }
  }

  render() {
    const { locked } = this.props;
    const { status } = this.state;
    let canDelete =
      status === AudioStatus.Start || status === AudioStatus.Recording;
    
    return (
      <div className="react-recording">
        <Dropzone
          locked={locked}
          status={status}
          saveAudio={this.saveAudio.bind(this)}
        />
        <div className="record-button-row">
          <Recording
            status={status}
            isShown={true}
            onStop={this.onStop.bind(this)}
            onSave={this.onSave.bind(this)}
          />
          <RecordButton
            status={status}
            blobUrl={this.state.blobUrl}
            onClick={this.startRecording.bind(this)}
          />
          <RecordingButton
            status={status}
            onClick={this.stopRecording.bind(this)}
          />
          <PlayButton status={status} onClick={this.playRecord.bind(this)} />
          <PauseButton status={status} onClick={this.stopRecord.bind(this)} />
          <button
            className={"btn delete-record " + (canDelete ? "disabled" : "")}
            onClick={this.deleteAudio.bind(this)}
            disabled={canDelete}
          >
            <span>Delete</span>
          </button>
        </div>
      </div>
    );
  }
}

export default SoundComponent;
