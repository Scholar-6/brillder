import { fileUrl } from 'components/services/uploadFile';
import React from 'react';

import './SoundLive.scss';


interface ImageProps {
  component: any;
}

const ImageLive: React.FC<ImageProps> = ({ component }) => {
  if (component.value) {
    return (
      <div className="audio-play-component">
        <audio
          controls
          style={{width: '100%'}}
          src={fileUrl(component.value)} />
      </div>
    );
  }
  return <div></div>;
}

export default ImageLive;
