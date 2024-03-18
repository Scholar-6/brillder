import React from 'react';
import { connect } from "react-redux";
import { isMobile } from 'react-device-detect';

import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/play';
import { fileUrl } from 'components/services/uploadFile';
import HoveredPhoneImage from './HoveredPhoneImage';


interface AnswerProps {
  imageHovered: boolean;
  fileName: string;
  imageSource: any;
  blur(): void;
}

const HoveredImageContent: React.FC<AnswerProps> = ({ imageHovered, imageSource, fileName, blur }) => {
  React.useEffect(() => {
    return () => {
      blur();
    }
    /*eslint-disable-next-line*/
  }, []);

  if (imageHovered) {
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

const mapDispatch = (dispatch: any) => ({
  blur: () => dispatch(actions.setImageBlur()),
});

export default connect(mapState, mapDispatch)(HoveredImageContent);
