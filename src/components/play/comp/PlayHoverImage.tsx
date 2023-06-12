import React from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { fileUrl } from 'components/services/uploadFile';
import { isPhone } from 'services/phone';
import actions from 'redux/actions/play';
import { ReduxCombinedState } from 'redux/reducers';

interface AnswerProps {
  fileName: string;
  imageCaption?: string;
  imageSource?: string;

  hovered: boolean;
  hover(value: string, source?: string): void;
  blur(): void;
}

const PlayQuestionImage: React.FC<AnswerProps> = ({ fileName, imageCaption, imageSource, ...props }) => {
  const [lastClick, setLastClick] = React.useState(0);

  const onDoubleClick = () => {
    if (props.hovered) {
      props.blur();
    } else {
      props.hover(fileName, imageSource);
    }
  }

  if (isPhone()) {
    return (
      <div className="image-container">
        <div className="absolute-image-hider-p3"
          onClick={e => {
            if (lastClick && e.timeStamp - lastClick < 250 || e.detail === 2) {
              setLastClick(0);
              onDoubleClick();
            } else {
              setLastClick(e.timeStamp);
            }
          }}
        />
        <div className="image-container-v5">
          <img alt="" className="no-pointer-events" src={fileUrl(fileName)} width="100%" />
        </div>
      </div>
    );
  }
  if (isMobile) {
    return (
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
    );
  }

  return (
    <img
      alt="" src={fileUrl(fileName)} width="100%"
      onMouseEnter={() => props.hover(fileName, imageSource)}
      onMouseLeave={props.blur}
    />
  );
}

const mapState = (state: ReduxCombinedState) => ({
  hovered: state.play.imageHovered, // for phones it is not hovered but double clicked
});

const mapDispatch = (dispatch: any) => ({
  hover: (fileName: string, imageSource: string) => dispatch(actions.setImageHover(fileName, imageSource)),
  blur: () => dispatch(actions.setImageBlur()),
});

export default connect(mapState, mapDispatch)(PlayQuestionImage);
