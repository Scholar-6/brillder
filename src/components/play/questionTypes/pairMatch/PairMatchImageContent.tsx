import React from 'react';
import { connect } from 'react-redux';

import { fileUrl } from 'components/services/uploadFile';
import actions from 'redux/actions/play';
import { isPhone } from 'services/phone';
import { ReduxCombinedState } from 'redux/reducers';

interface AnswerProps {
  fileName: string;
  imageCaption?: string;

  hovered: boolean;
  hover(value: string): void;
  blur(): void;
}

const PhoneImageContent: React.FC<AnswerProps> = ({ fileName, imageCaption, ...props }) => {
  const [lastClick, setLastClick] = React.useState(0);

  const onDoubleClick = () => {
    if (props.hovered) {
      props.blur();
    } else {
      props.hover(fileName)
    }
  }

  return (
    <div className="image-container">
      <img
        alt="" src={fileUrl(fileName)} width="100%"
        onClick={e => {
          if (lastClick && e.timeStamp - lastClick < 250) {
            setLastClick(0);
            onDoubleClick();
          } else {
            setLastClick(e.timeStamp);
          }          
        }}
      />
      {imageCaption && <div>{imageCaption}</div>}
    </div>
  );
}

const PairMatchImageContent: React.FC<AnswerProps> = ({ fileName, imageCaption, ...props }) => {
  if (isPhone()) {
    return <PhoneImageContent fileName={fileName} imageCaption={imageCaption} {...props} />
  }
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

const mapState = (state: ReduxCombinedState) => ({
  hovered: state.play.imageHovered, // for phones it is not hovered but double clicked
});

const mapDispatch = (dispatch: any) => ({
  hover: (fileName: string) => dispatch(actions.setImageHover(fileName)),
  blur: () => dispatch(actions.setImageBlur()),
});

export default connect(mapState, mapDispatch)(PairMatchImageContent);
