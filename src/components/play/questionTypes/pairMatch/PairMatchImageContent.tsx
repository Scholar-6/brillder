import React from 'react';
import { connect } from 'react-redux';

import { fileUrl } from 'components/services/uploadFile';
import actions from 'redux/actions/play';

interface AnswerProps {
  fileName: string;
  imageCaption?: string;

  hover(value: string): void;
  blur(): void;
}

const PairMatchImageContent: React.FC<AnswerProps> = ({ fileName, imageCaption, ...props }) => {
  return (
    <div className="image-container">
      <img
        alt="" src={fileUrl(fileName)} width="100%"
        onMouseEnter={() => props.hover(fileName)}
        onMouseLeave={props.blur}
      />
      {imageCaption && <div>{imageCaption}</div>}
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  hover: (fileName: string) => dispatch(actions.setImageHover(fileName)),
  blur: () => dispatch(actions.setImageBlur()),
});

export default connect(null, mapDispatch)(PairMatchImageContent);
