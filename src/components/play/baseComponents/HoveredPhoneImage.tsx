import React from 'react';

import { fileUrl } from 'components/services/uploadFile';
import { connect } from "react-redux";
import actions from 'redux/actions/play';

interface AnswerProps {
  fileName: string;
  imageSource: any;
  blur(): void;
}

const HoveredPhoneImageContent: React.FC<AnswerProps> = ({ fileName, imageSource, blur }) => {
  return (
    <div className="center-fixed-image" onClick={e => blur()}>
      <div className="sd-image-container">
        <img alt="" src={fileUrl(fileName)} />
        <div className="hover-source-container2">
          <div className="image-source">{imageSource}</div>
        </div>
      </div>
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  blur: () => dispatch(actions.setImageBlur()),
});

export default connect(null, mapDispatch)(HoveredPhoneImageContent);
