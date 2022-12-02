import React from "react";
import WaveSurfer from "wavesurfer.js";

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
  playing: boolean;

  trackRef: React.RefObject<any>;
  waveformRef: React.RefObject<any>;
  waveSurfer: any;
}

class AudioComponent extends React.Component<SoundProps, SoundState> {
  constructor(props: SoundProps) {
    super(props);

    this.state = {
      audioState: AudioState.Init,
      currentTime: "00:00",
      duration: "00:00",
      playing: false,
      volume: 1,
      volumeHovered: false,
      rangeValue: 0,

      trackRef: React.createRef<any>(),
      waveformRef: React.createRef<any>(),
      waveSurfer: null
    };
  }

  componentDidMount(): void {
    const waveStyles = {
      barGap: 4,
      barWidth: 4,
      barHeight: 4,
      barRadius: 4,
      cursorWidth: 0,
      height: 100,
      hideScrollbar: true,
      progressColor: '#c43c30',
      cursorColor: 'red',
      normalize: true,
      responsive: true,
      waveColor: '#001c58',
    };

    if (this.state.waveformRef.current && this.state.trackRef.current) {
      const waveSurfer = WaveSurfer.create({
        ...waveStyles,
        container: "#waveform",
        responsive: true,
        backend: "MediaElement"
      });
      // Load the waveForm json if provided
      waveSurfer.load(this.state.trackRef.current)

      waveSurfer.on("ready", () => {
        this.setState({ waveSurfer })
        waveSurfer.zoom(1);
      });
    }
  }

  getTime(t: any) {
    let m = ~~(t / 60),
      s = ~~(t % 60);
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  }

  setVolume(volume: number) {
    this.state.waveSurfer.setVolume(volume);
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

  onLoadedMetadata = () => {
    if (this.state.trackRef.current) {
      this.setState({duration: this.getTime(this.state.trackRef.current.duration)});
    }
  }

  render() {
    return (
      <div>
        <div className="play-wave-container">
          <div className="play-icon-container-d1">
            <SpriteIcon className="play-icon-d1" name={this.state.playing ? 'feather-pause-circle' : "feather-play-circle"} onClick={() => {
              let playing = !this.state.playing;
              if (playing) {
                this.state.waveSurfer.play();
              } else {
                this.state.waveSurfer.pause();
              }
              this.setState({ playing });
            }} />
          </div>
          {this.props.src &&
            <div className="relative-waves-container">
              <div className="react-waves">
                <div ref={this.state.waveformRef} id="waveform" />
                <audio
                  src={fileUrl(this.props.src ? this.props.src : "")}
                  ref={this.state.trackRef}
                  onLoadedMetadata={this.onLoadedMetadata.bind(this)}
                />
              </div>
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
