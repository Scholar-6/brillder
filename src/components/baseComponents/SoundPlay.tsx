import React from 'react';
import WaveSurfer from 'wavesurfer.js';

import './SoundPlay.scss';
import SpriteIcon from './SpriteIcon';
import { generateId } from 'components/build/buildQuestions/questionTypes/service/questionBuild';

interface Props {
  element: string;
}

interface State {
  playing: boolean;
  volume: number;
  fileСaption: string | null;
  fileUrl: string | null;

  trackRef: React.RefObject<any>;
  waveformRef: React.RefObject<any>;
  waveSurfer: any;
  waveId: string;
  currentTime: string;
  duration: string;
}

class SoundPlay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const div = document.createElement('div');
    div.innerHTML = props.element;
    const fileUrl = div.children[0].getAttribute('data-value');
    const fileСaption = div.children[0].getAttribute('data-caption');

    console.log(fileUrl);

    this.state = {
      playing: false,
      volume: 1,
      fileСaption,
      fileUrl,

      waveId: "waveform-l-" + generateId(),

      currentTime: "00:00",
      duration: "00:00",

      trackRef: React.createRef<any>(),
      waveformRef: React.createRef<any>(),
      waveSurfer: null
    }
  }

  componentDidMount(): void {
    const waveStyles = {
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
    };

    if (this.state.waveformRef.current && this.state.trackRef.current) {
      const waveSurfer = WaveSurfer.create({
        ...waveStyles,
        container: "#" + this.state.waveId,
        responsive: true,
        backend: "MediaElement"
      });
      // Load the waveForm json if provided
      waveSurfer.load(this.state.trackRef.current)

      console.log('surfer loaded');

      /*
      waveSurfer.on("ready", () => {
        this.setState({ waveSurfer })
        waveSurfer.zoom(1);
      });

      waveSurfer.on('pause', () => {
        console.log('sound finished paused')
      });

      waveSurfer.on('finish', () => {
        console.log('sound finished finish')
        this.setState({ playing: false });
        waveSurfer.seekTo(0);
      });*/
    }
  }

  play() {
    this.setState({ playing: true });
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

  getTime(t: any) {
    let m = ~~(t / 60),
      s = ~~(t % 60);
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  }

  pause() {
    this.setState({ playing: false });
  }

  onLoadedMetadata = () => {
    if (this.state.trackRef.current) {
      this.setState({ duration: this.getTime(this.state.trackRef.current.duration) });
    }
  }

  render() {
    if (this.state.fileUrl) {
      return <div className="custom-sound-with-waves">
        <div className="custom-audio-controls">
          <div className="button-container">
            <SpriteIcon
              className={this.state.playing ? "pause-filled" : "play-thick"}
              name={this.state.playing ? 'pause-filled' : "play-thick"}
              onClick={e => {
                e.stopPropagation();
                let playing = !this.state.playing;
                if (playing) {
                  this.state.waveSurfer.play();
                } else {
                  this.state.waveSurfer.pause();
                }
                this.setState({ playing });
              }}
            />
          </div>
          <div className="react-waves">
            <div ref={this.state.waveformRef} id={this.state.waveId} />
            <audio
              src={this.state.fileUrl}
              ref={this.state.trackRef}
              onLoadedMetadata={this.onLoadedMetadata.bind(this)}
            />
          </div>
          <div className="volume-container-main">
            <div className="volume-container">
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
        <div className="sound-caption">{this.state.fileСaption}</div>
      </div>
    }
    return (<div />);
  }
}

export default SoundPlay;
