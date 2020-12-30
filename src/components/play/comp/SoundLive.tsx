import React from 'react';

import './SoundLive.scss';
import Audio from 'components/build/buildQuestions/questionTypes/sound/Audio';

interface ImageProps {
  refs?: any;
  component: any;
}

const SoundLive: React.FC<ImageProps> = ({ component }) => {
  if (component.value) {
    return (
      <div className="audio-play-component">
        <Audio src={component.value} />
      </div>
    );
  }
  return <div></div>;
}

export default SoundLive;
