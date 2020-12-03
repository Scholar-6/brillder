import React from "react";

import { ChooseOneAnswer } from "../chooseOneBuild/types";
import { QuestionValueType } from "../types";

import SoundRecordDialog from "./SoundRecordDialog";
import RemoveButton from "../components/RemoveButton";
import DeleteDialog from "components/baseComponents/deleteBrickDialog/DeleteDialog";
import Audio from './Audio';

interface SoundProps {
  locked: boolean;
  answer: ChooseOneAnswer;
  save(soundFile: string, caption: string): void;
  clear(): void;
}

interface SoundState {
  isOpen: boolean;
  isClearOpen: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

class SoundRecord extends React.Component<SoundProps, SoundState> {
  constructor(props: SoundProps) {
    super(props);

    this.state = {
      isOpen: false,
      isClearOpen: false,
      audioRef: React.createRef<HTMLAudioElement>(),
    };
  }

  setOpen = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  setClear = (isClearOpen: boolean) => {
    this.setState({ isClearOpen });
  };

  play() {
    const { current } = this.state.audioRef;
    if (current) {
      current.play();
      current.onended = () => {

      }
    }
  }

  pause() {
    const { current } = this.state.audioRef;
    if (current) {
      current.pause();
    }
  }

  renderSoundComponent(answer: ChooseOneAnswer) {
    if (answer.answerType === QuestionValueType.Sound) {
      return (
        <div>
          <RemoveButton onClick={() => this.setClear(true)} />
          <Audio answer={answer} />
        </div>
      );
    }
    return (
      <div
        className="sound-record-button"
        onClick={() => {
          if (!this.props.locked) {
            this.setOpen(true);
          }
        }}
      >
        <img alt="sound-image" src="/images/soundicon-dark-blue.png" />
      </div>
    );
  }

  render() {
    const { isOpen } = this.state;
    const { answer } = this.props;

    return (
      <div>
        {this.renderSoundComponent(answer)}
        {isOpen && (
          <SoundRecordDialog
            isOpen={isOpen}
            save={(v, caption) => {
              this.props.save(v, caption);
              this.setOpen(false);
            }}
            data={this.props.answer}
            close={() => this.setOpen(false)}
          />
        )}
        <DeleteDialog
          isOpen={this.state.isClearOpen}
          label="Delete sound?"
          submit={() => {
            this.props.clear();
            this.setClear(false);
          }}
          close={() => this.setClear(false)}
        />
      </div>
    );
  }
}

export default SoundRecord;
