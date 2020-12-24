import { ImageAlign, ImageComponentData } from 'components/build/buildQuestions/components/Image/model';
import React from 'react';

import './ImageLive.scss';


interface ImageProps {
  refs?: any;
  component: ImageComponentData;
}

const ImageLive: React.FC<ImageProps> = ({ component, refs }) => {
  if (component.value) {
    let className="image-play-container2";
    if (component.imageAlign === ImageAlign.center) {
      className += ' center';
    }
    let height="auto";
    if (component.imageHeight > 1) {
      height = component.imageHeight + 'vh';
    }
    return (
      <div className={className} ref={refs}>
        <div className="image-play-container">
          <img
            alt="play" className="image-play"
            src={`${process.env.REACT_APP_BACKEND_HOST}/files/${component.value}`}
            style={{height}}
          />
          {component.imageCaption && <figcaption className="image-caption">{component.imageCaption}</figcaption>}
        </div>
      </div>
    );
  }
  return <div></div>;
}

export default ImageLive;
