import React from "react";

import { fileUrl } from "components/services/uploadFile";
import { ChooseOneAnswer } from "../chooseOneBuild/types";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface SoundProps {
  answer: ChooseOneAnswer;
}

enum AudioState {
  Init,
  Play,
  Paused,
}

interface SoundState {
  volume: number;
  volumeHovered: boolean;
  rangeValue: number;
  currentTime: string;
  duration: string;
  audioState: AudioState;
  audio: any;
}

class AudioComponent extends React.Component<SoundProps, SoundState> {
  constructor(props: SoundProps) {
    super(props);

    const { answer } = this.props;
    const audio = new Audio(fileUrl(answer.soundFile ? answer.soundFile : ""));

    audio.addEventListener("timeupdate", this.progress.bind(this), false);
    audio.addEventListener("canplaythrough", this.onLoad.bind(this), false);

    this.state = {
      audioState: AudioState.Init,
      currentTime: "00:00",
      duration: "00:00",
      audio,
      volume: 0,
      volumeHovered: false,
      rangeValue: 0,
    };
  }

  onLoad() {
    const { duration } = this.state.audio;
    this.setState({
      duration: this.getTime(duration),
      volume: this.state.audio.volume,
    });
  }

  setVolume(volume: number) {
    this.state.audio.volume = volume;
    this.setState({ volume });
  }

  toggleVolume() {
    if (this.state.volume > 0) {
      this.setVolume(0);
    } else {
      this.setVolume(1);
    }
  }

  getTime(t: any) {
    var m = ~~(t / 60),
      s = ~~(t % 60);
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  }

  progress() {
    const { audio } = this.state;
    const { currentTime } = audio;
    const rangeValue = ~~((100 / audio.duration) * currentTime);
    this.setState({ currentTime: this.getTime(currentTime), rangeValue });
  }

  setRange(e: any) {
    // set time by input
  }

  play() {
    const { audio } = this.state;
    if (audio) {
      audio.play();
      this.setState({ audioState: AudioState.Play });
      audio.onended = () => {
        this.setState({ audioState: AudioState.Init });
      };
    }
  }

  pause() {
    const { audio } = this.state;
    if (audio) {
      audio.pause();
      this.setState({ audioState: AudioState.Paused });
    }
  }

  render() {
    return (
      <div>
        <div className="custom-audio-controls">
          <div className="button-container">
            {this.state.audioState === AudioState.Init ||
            this.state.audioState === AudioState.Paused ? (
              <SpriteIcon name="play-thin" onClick={this.play.bind(this)} />
            ) : (
              <SpriteIcon name="pause-filled" onClick={this.pause.bind(this)} />
            )}
          </div>
          <div className="time-text">
            {this.state.currentTime} / {this.state.duration}
          </div>
          <div className="input-container">
            <input
              type="range"
              value={this.state.rangeValue}
              onChange={this.setRange.bind(this)}
              max={100}
            />
          </div>
          <div className="volume-container-main">
          <div
            className={`volume-container ${this.state.volumeHovered ? 'hovered' : ''}`}
            onMouseEnter={() => this.setState({ volumeHovered: true })}
            onMouseLeave={() => this.setState({ volumeHovered: false })}
          >
            <SpriteIcon
              name={this.state.volume > 0 ? "volume-1" : "volume-x"}
              onClick={this.toggleVolume.bind(this)}
            />
            {this.state.volumeHovered && (
              <div className="volume-absolute-range">
                <input type="range" value={this.state.volume} />
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AudioComponent;
