import ReactWaves from '@dschoon/react-waves';
import React from 'react';

import './SoundPlay.scss';
import SpriteIcon from './SpriteIcon';

interface Props {
  element: string;
}

interface State {
  playing: boolean;
  volume: number;
  fileUrl: string | null;
}

class SoundPlay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const div = document.createElement('div');
    div.innerHTML = props.element;
    const fileUrl = div.children[0].getAttribute('data-value');
    console.log(props.element, fileUrl);

    this.state = {
      playing: false,
      volume: 1,
      fileUrl
    }
  }

  play() {
    this.setState({ playing: true });
  }

  toggleVolume() {
    if (this.state.volume > 0.5) {
      this.setState({ volume: 0 });
    } else if (this.state.volume >= 0 && this.state.volume < 0.5) {
      this.setState({ volume: 0.5 });
    } else {
      this.setState({ volume: 1 });
    }
  }

  pause() {
    this.setState({ playing: false });
  }

  render() {
    if (this.state.fileUrl) {
      return <div className="custom-sound-with-waves">
        <div className="custom-audio-controls">
          <div className="button-container">
            {!this.state.playing ? (
              <SpriteIcon name="play-thick" onClick={this.play.bind(this)} />
            ) : (
              <SpriteIcon name="pause-filled" onClick={this.pause.bind(this)} />
            )}
          </div>
          <ReactWaves
            audioFile={this.state.fileUrl}
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
            volume={this.state.volume}
            zoom={1}
            playing={this.state.playing}
          />
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
                this.setState({ volume: Number(e.target.value) / 100 });
              }}
            />
          </div>
        </div>
      </div>
    }
    return (<div />);
  }
}

export default SoundPlay;
