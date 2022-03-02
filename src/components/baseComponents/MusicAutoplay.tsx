import React from 'react';

interface MusicProps {
  url: string;
}

interface MusicState {
  audio: HTMLAudioElement;
}

class MusicAutoplay extends React.Component<MusicProps, MusicState> {
  constructor(props: MusicProps) {
    super(props);
    const audio = new Audio(props.url); 
    this.state = {
      audio,
    }
    audio.oncanplaythrough = function () {
      audio.play();
    }
  }

  render() {
    return <div />;
  }
}

export default MusicAutoplay;