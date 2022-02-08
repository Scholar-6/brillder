import React from "react";

import './Audio.scss';
import { fileUrl } from "components/services/uploadFile";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import ReactWaves from "@dschoon/react-waves";

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
  playing: boolean;
}

class AudioComponent extends React.Component<SoundProps, SoundState> {
  constructor(props: SoundProps) {
    super(props);

    const { src } = this.props;
    const audio = new Audio(fileUrl(src ? src : ""));
    audio.addEventListener("canplaythrough", this.onLoad.bind(this), false);

    this.state = {
      audioState: AudioState.Init,
      currentTime: "00:00",
      duration: "00:00",
      audio,
      playing: false,
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
    this.setState({ volume });
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

  /*eslint-disable-next-line*/
  onChange(a: any, b: any) {
    var time = this.getTime(a);
    this.setState({currentTime: time});
  }

  render() {
    var Waves = ReactWaves as any;
    return (
      <div>
        <div className="play-wave-container">
          <div className="play-icon-container-d1">
            <SpriteIcon className="play-icon-d1" name={this.state.playing ? 'feather-pause-circle' : "feather-play-circle"} onClick={() => this.setState({ playing: !this.state.playing })} />
          </div>
          {this.props.src &&
            <div className="relative-waves-container">
              <Waves
                audioFile={fileUrl(this.props.src)}
                className={"react-waves"}
                pos={0}
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
                /*eslint-disable-next-line*/
                onPosChange={this.onChange.bind(this)}
                volume={this.state.volume}
                zoom={1}
                playing={this.state.playing}
              />
              <div className="absolute-start-time">
                {this.state.currentTime}
              </div>
              <div className="absolute-end-time">
                {this.state.duration}
              </div>
            </div>
          }
          <div className="custom-audio-controls">
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
      </div>
    );
  }
}

export default AudioComponent;
