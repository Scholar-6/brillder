import React from 'react';

import { fileUrl } from 'components/services/uploadFile';
import { connect } from "react-redux";
import { ReduxCombinedState } from 'redux/reducers';
import { isPhone } from 'services/phone';
import HoveredPhoneImage from './HoveredPhoneImage';
import { isMobile } from 'react-device-detect';


interface AnswerProps {
  imageHovered: boolean;
  fileName: string;
  imageSource: any;
}

const HoveredImageContent: React.FC<AnswerProps> = ({ imageHovered, imageSource, fileName }) => {
  if (imageHovered) {
    if (isPhone()) {
      return <HoveredPhoneImage fileName={fileName} imageSource={imageSource} />
    }

    if (isMobile) {
      return (
        <div>
          <HoveredPhoneImage fileName={fileName} imageSource={imageSource} />
        </div>
      );
    }

    return (
      <div className="center-fixed-image unselectable">
        <div className="sd-image-container">
          <img alt="" src={fileUrl(fileName)} />
          <div className="hover-source-container2">
            <div className="image-source">{imageSource}</div>
          </div>
        </div>
      </div>
    );
  }
  return <div className="tablet-hidden" />;
}

const mapState = (state: ReduxCombinedState) => ({
  imageHovered: state.play.imageHovered,
  fileName: state.play.fileName,
  imageSource: state.play.imageSource
});

export default connect(() => mapState)(HoveredImageContent);
