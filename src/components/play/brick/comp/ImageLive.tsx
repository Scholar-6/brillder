import React from 'react';

import './ImageLive.scss';


interface ImageProps {
  component: any;
}

const ImageLive: React.FC<ImageProps> = ({ component }) => {
  return (
    <div>
      <img alt="play" className="image-play" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${component.value}`} />
    </div>
  );
}

export default ImageLive;
