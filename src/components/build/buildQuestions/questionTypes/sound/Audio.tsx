import React from "react";

import './Audio.scss';
import { fileUrl } from "components/services/uploadFile";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface SoundProps {
  src?: string;
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

    const { src } = this.props;
    const audio = new Audio(fileUrl(src ? src : ""));

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
    const {audio} = this.state;
    audio.volume = volume;
    this.setState({ audio, volume });
  }

  toggleVolume() {
    if (this.state.volume > 0.5) {
      this.setVolume(0);
    } else if (this.state.volume >= 0 && this.state.volume < 0.5) {
      this.setVolume(0.5);
    } else {
      this.setVolume(1);
    }
  }

  getTime(t: any) {
    let m = ~~(t / 60),
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
    const {value} = e.target;
    const {audio} = this.state;
    const audioValue = (value * audio.duration) / 100;
    audio.currentTime = audioValue;
    this.setState({rangeValue: value});
    e.stopPropagation();
    e.preventDefault();
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
              <SpriteIcon name="play-thick" onClick={this.play.bind(this)} />
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
              draggable="true"
              onDragStart={e => e.preventDefault()}
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
                name={this.state.volume > 0.5 ? "volume-2" : this.state.volume > 0 ? "volume-1" : "volume-x"}
                onClick={this.toggleVolume.bind(this)}
              />
            </div>
            <input
              type="range" min={0} max={100}
              value={this.state.volume * 100}
              draggable="true"
              onDragStart={e => e.preventDefault()}
              onChange={e => {
                this.setVolume(Number(e.target.value) / 100);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AudioComponent;
