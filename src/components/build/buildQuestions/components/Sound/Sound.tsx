import React from "react";
import Y from "yjs";
import _ from "lodash";

import "./Sound.scss";
import Dropzone from "./Dropzone";
import PauseButton from "./components/buttons/PauseButton";
import PlayButton from "./components/buttons/PlayButton";
import RecordingButton from "./components/buttons/RecordingButton";
import RecordButton from "./components/buttons/RecordButton";
import { fileUrl, uploadFile } from "components/services/uploadFile";
import Recording from "./components/Recording";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";

interface SoundProps {
  locked: boolean;
  index: number;
  data: Y.Map<any>;

  //phone preview
  onFocus(): void;
}

interface SoundState {
  status: AudioStatus;
  blobUrl: string;
  audio: HTMLAudioElement;
  cantSave: boolean;
  observer: any;
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
    if (props.data && props.data.get("value")) {
      initAudio = new Audio(fileUrl(props.data.get("value")));
      initStatus = AudioStatus.Recorded;
    }

    this.state = {
      status: initStatus,
      blobUrl: "",
      audio: initAudio,
      cantSave: false,
      observer: null
    };
  }

  componentDidMount() {
    const observer = _.throttle((evt: any) => {
      const newValue = this.props.data.get("value");
      if (newValue) {
        const updatedAudio = new Audio(fileUrl(newValue));
        this.setState({ audio: updatedAudio, status: AudioStatus.Recorded });
      } else {
        const updatedAudio = new Audio(fileUrl(newValue));
        this.setState({ audio: updatedAudio, status: AudioStatus.Start });
      }
    }, 200);
    this.props.data.observe(observer);
    this.setState({observer});
  }

  componentWillUnmount() {
    if (this.state.observer) {
      this.props.data.unobserve(this.state.observer);
    }
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
    this.props.data.set("value", "");
  }

  saveAudio(file: any) {
    if (file) {
      uploadFile(
        file,
        (res: any) => {
          this.props.data.set("value", res.data.fileName);
          this.setRecorded();
        },
        () => {
          this.setState({cantSave: true});
        }
      );
    }
  }

  render() {
    const { locked } = this.props;
    const { status } = this.state;
    let canDelete = status === AudioStatus.Start || status === AudioStatus.Recording;
    
    return (
      <div className="react-recording" onClick={this.props.onFocus}>
        <div className="text-label-container">
          Sound
        </div>
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
        <ValidationFailedDialog
          isOpen={this.state.cantSave}
          header="Can`t save audio file"
          close={() => this.setState({cantSave: true})}
        />
      </div>
    );
  }
}

export default React.memo(SoundComponent);
