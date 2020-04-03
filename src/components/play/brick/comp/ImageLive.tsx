import React from 'react';

import './ImageLive.scss';


interface ImageProps {
  component: any;
}

const ImageLive: React.FC<ImageProps> = ({ component }) => {
  if (component.value) {
    return (
      <div>
        <img alt="play" className="image-play" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${component.value}`} />
      </div>
    );
  }
  return <div></div>;
}

export default ImageLive;
