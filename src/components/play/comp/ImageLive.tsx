import { ImageAlign, ImageComponentData } from 'components/build/buildQuestions/components/Image/model';
import { fileUrl } from 'components/services/uploadFile';
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
          <div className="il-image-container">
            <img
              alt="play" className="image-play"
              src={fileUrl(component.value)}
              style={{height}}
            />
            {component.imageSource && <div className="image-source-container">
              <figure className="image-source">{component.imageSource}</figure>
            </div>}
          </div>
          {component.imageCaption && <figcaption className="image-caption">{component.imageCaption}</figcaption>}
        </div>
      </div>
    );
  }
  return <div></div>;
}

export default ImageLive;
