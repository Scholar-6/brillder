import React from 'react';

import { fileUrl } from 'components/services/uploadFile';
import { connect } from "react-redux";
import { ReduxCombinedState } from 'redux/reducers';


interface AnswerProps {
  imageHovered: boolean;
  fileName: string;
}

const HoveredImageContent: React.FC<AnswerProps> = ({ imageHovered, fileName }) => {
  if (imageHovered) {
    return (
      <div className="center-fixed-image unselectable">
        <img alt="" src={fileUrl(fileName)} />
      </div>
    );
  }
  return <div />;
}

const mapState = (state: ReduxCombinedState) => ({
  imageHovered: state.play.imageHovered,
  fileName: state.play.fileName
});

export default connect(() => mapState)(HoveredImageContent);
