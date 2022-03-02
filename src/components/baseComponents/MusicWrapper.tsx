import React from 'react';

interface MusicProps {
  url: string;
  startTime: number;
  disabled?: boolean;
  children: any;
}

interface MusicState {
  audio: HTMLAudioElement;
}

class MusicWrapper extends React.Component<MusicProps, MusicState> {
  constructor(props: MusicProps) {
    super(props);
    this.state = {
      audio: new Audio(props.url),
    }
  }

  togglePlay() {
    if (!this.props.disabled) {
      /*eslint-disable-next-line*/
      this.state.audio.currentTime = this.props.startTime;
      this.state.audio.play();
    }
  }

  render() {
    return (
      <div onClick={this.togglePlay.bind(this)}>
        {this.props.children}
      </div>
    );
  }
}

export default MusicWrapper;