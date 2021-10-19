import React from "react";
import ReactWaves from "@dschoon/react-waves";

import "./Sound.scss";
import Dropzone from "./Dropzone";
import PauseButton from "./components/buttons/PauseButton";
import PlayButton from "./components/buttons/PlayButton";
import RecordingButton from "./components/buttons/RecordingButton";
import RecordButton from "./components/buttons/RecordButton";
import { getFile, uploadFile } from "components/services/uploadFile";
import Recording from "./components/Recording";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";

interface SoundProps {
  locked: boolean;
  index: number;
  data: any;
  validationRequired: boolean;
  save(): void;
  updateComponent(component: any, index: number): void;
  //phone preview
  onFocus(): void;
}

interface SoundState {
  status: AudioStatus;
  blobUrl: string;
  cantSave: boolean;
  file: File | null;
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

    let initStatus = AudioStatus.Start;
    if (props.data && props.data.value) {
      initStatus = AudioStatus.Recorded;
    }

    this.state = {
      status: initStatus,
      blobUrl: "",
      file: null,
      cantSave: false
    };

    if (props.data.value) {
      this.getAudio();
    }
  }

  async getAudio() {
    const file = await getFile(this.props.data.value)
    if (file) {
      this.setState({ file });
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
    this.setState({ blobUrl: blob.blobURL });
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
    this.setState({ status: AudioStatus.Play });
  }

  deleteAudio() {
    if (this.props.locked) {
      return;
    }
    this.setState({ blobUrl: "", status: AudioStatus.Start });

    // clean up
    let comp = Object.assign({}, this.props.data);
    comp.value = '';
    this.props.updateComponent(comp, this.props.index);
    this.props.save();
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
          this.setState({ cantSave: true });
          this.setState({ file });
        }
      );
    }
  }

  render() {
    const { locked } = this.props;
    const { status } = this.state;
    const canDelete =
      status === AudioStatus.Start || status === AudioStatus.Recording;

    return (
      <div className={`react-recording ${(this.props.validationRequired && !this.props.data.value) ? 'invalid' : ''}`} onClick={this.props.onFocus}>
        <div className="text-label-container">
          Sound
        </div>
        <Dropzone
          locked={locked}
          status={status}
          saveAudio={this.saveAudio.bind(this)}
        />
        <div className={`record-button-row ${(status === AudioStatus.Recorded || status === AudioStatus.Play || status === AudioStatus.Stop) && 'top-wave'}`}>
          {(status === AudioStatus.Recorded || status === AudioStatus.Play || status === AudioStatus.Stop) && this.state.file && <div className="wave">
            <ReactWaves
              audioFile={this.state.file}
              className={"react-waves"}
              options={{
                barGap: 4,
                barWidth: 4,
                barHeight: 4,
                barRadius: 4,
                cursorWidth: 0,
                height: 150,
                hideScrollbar: true,
                progressColor: '#c43c30',
                cursorColor: 'red',
                normalize: true,
                responsive: true,
                waveColor: '#001c58',
              }}
              volume={1}
              zoom={1}
              playing={status === AudioStatus.Play}
            />
          </div>}
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
          close={() => this.setState({ cantSave: false })}
        />
      </div>
    );
  }
}

export default SoundComponent;
