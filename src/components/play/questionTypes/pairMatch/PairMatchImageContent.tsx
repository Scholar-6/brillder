import React from 'react';
import { connect } from 'react-redux';

import { fileUrl } from 'components/services/uploadFile';
import actions from 'redux/actions/play';
import { isPhone } from 'services/phone';
import { ReduxCombinedState } from 'redux/reducers';
import { isMobile } from 'react-device-detect';

interface AnswerProps {
  fileName: string;
  imageCaption?: string;
  imageSource?: string;

  hovered: boolean;
  hover(value: string, source?: string): void;
  blur(): void;
}

const PairMatchImageContent: React.FC<AnswerProps> = ({ fileName, imageCaption, imageSource, ...props }) => {
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
  if (isMobile) {
    return (
      <div className="image-container">
        <div>
          <div className="flex-align">
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
          </div>
          {imageCaption && <div>{imageCaption}</div>}
        </div>
      </div>
    );
  }
  return (
    <div className="image-container">
      <div>
        <div className="flex-align">
          <img
            alt="" src={fileUrl(fileName)} width="100%"
            onMouseEnter={() => props.hover(fileName, imageSource)}
            onMouseLeave={props.blur}
          />
        </div>
        {imageCaption && <div>{imageCaption}</div>}
      </div>
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  hovered: state.play.imageHovered, // for phones it is not hovered but double clicked
});

const mapDispatch = (dispatch: any) => ({
  hover: (fileName: string, imageSource: string) => dispatch(actions.setImageHover(fileName, imageSource)),
  blur: () => dispatch(actions.setImageBlur()),
});

export default connect(mapState, mapDispatch)(PairMatchImageContent);
