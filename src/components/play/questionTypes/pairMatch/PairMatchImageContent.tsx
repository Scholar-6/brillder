import React from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { fileUrl } from 'components/services/uploadFile';
import { isPhone } from 'services/phone';
import actions from 'redux/actions/play';
import { ReduxCombinedState } from 'redux/reducers';
import MathInHtml from 'components/play/baseComponents/MathInHtml';
import { stripHtml } from 'components/build/questionService/ConvertService';

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
    let imageCaptionS = '';
    if (imageCaption) {
      imageCaptionS = stripHtml(imageCaption);
    }
    console.log('render answer');
    return (
      <div className="image-container">
        <div className="absolute-image-hider-p3"
          onClick={e => {
            console.log('click phone')
            if (lastClick && e.timeStamp - lastClick < 250) {
              console.log('double click');
              setLastClick(0);
              onDoubleClick();
            } else {
              console.log('set last click')
              setLastClick(e.timeStamp);
            }
          }}
        />
        <div className="image-container-v5">
          <img alt="" className="no-pointer-events" src={fileUrl(fileName)} width="100%" />
        </div>
        {imageCaptionS && imageCaption && <div className="image-caption-v4">
          <div>
            <MathInHtml value={imageCaption} />
          </div>
        </div>
        }
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
          {imageCaption && <div dangerouslySetInnerHTML={{ __html: imageCaption }} />}
        </div>
      </div>
    );
  }

  return (
    <div className="image-container">
      <div>
        <div className="flex-align image-container-v4">
          <img
            alt="" src={fileUrl(fileName)} width="100%"
            onMouseEnter={() => props.hover(fileName, imageSource)}
            onMouseLeave={props.blur}
          />
        </div>
        {imageCaption && <div className='image-caption-v4'>
          <div>
            <MathInHtml value={imageCaption} />
          </div>
        </div>}
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
