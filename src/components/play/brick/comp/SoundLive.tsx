import React from 'react';

import './SoundLive.scss';


interface ImageProps {
  component: any;
}

const ImageLive: React.FC<ImageProps> = ({ component }) => {
  if (component.value) {
    return (
      <div>
        <audio
          controls
          style={{width: '100%'}}
          src={`${process.env.REACT_APP_BACKEND_HOST}/files/${component.value}`} />
      </div>
    );
  }
  return <div></div>;
}

export default ImageLive;
