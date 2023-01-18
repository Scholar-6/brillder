import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { fileUrl } from 'components/services/uploadFile';
import { isPhone } from 'services/phone';
import actions from 'redux/actions/play';
import { ReduxCombinedState } from 'redux/reducers';
import MathInHtml from 'components/play/baseComponents/MathInHtml';

interface AnswerProps {
  fileName: string;
  imageCaption?: string;
  imageSource?: string;

  hovered: boolean;
  hover(value: string, source?: string): void;
  blur(): void;
}

const PairMatchImageContent: React.FC<AnswerProps> = ({ fileName, imageCaption, imageSource, ...props }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [lastClick, setLastClick] = React.useState(0);

  useEffect(() => {
    const element = ref.current;

    const preventDefaultR1 = (event: any) => {
      event.preventDefault();
    }

    element?.addEventListener('contextmenu', preventDefaultR1);

    return () => {
      element?.removeEventListener('contextmenu', event => preventDefaultR1);
    }
  }, []);

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
        {imageCaption && <div dangerouslySetInnerHTML={{__html: imageCaption}} />}
      </div>
    );
  }
  if (isMobile) {
    return (
      <div className="image-container">
        <div>
          <div className="flex-align" ref={ref}>
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
          {imageCaption && <div dangerouslySetInnerHTML={{__html: imageCaption}}/>}
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
        {imageCaption && <MathInHtml value={imageCaption} /> }
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
