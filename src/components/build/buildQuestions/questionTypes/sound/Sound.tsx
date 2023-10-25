import React from "react";
import { fileUrl, uploadFile } from "components/services/uploadFile";
import Dropzone from "../../components/Sound/Dropzone";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";

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
  cantSave: boolean;
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
      cantSave: false
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
        },
        () => {
          this.setState({cantSave: true});
        }
      );
    }
  }

  render() {
    const { locked } = this.props;
    
    return (
      <div className="react-recording">
        <Dropzone
          locked={locked}
          status={AudioStatus.Start}
          saveAudio={this.saveAudio.bind(this)}
        />
        <ValidationFailedDialog
          isOpen={this.state.cantSave}
          header="Can`t save audio file"
          close={() => this.setState({cantSave: false})}
        />
      </div>
    );
  }
}

export default SoundComponent;
