import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/play';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { isPhone } from 'services/phone';
import { isMobile } from 'react-device-detect';


interface SpacesProps {
  index: number;
  value: string;
  className?: string;

  hovered: boolean;
  hover: any;
  blur: any;
}

const HtmlImageWithSpaces: React.FC<SpacesProps> = ({ index, className, value, hover, blur, hovered }) => {
  const [lastClick, setLastClick] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const {current} = containerRef;
    if (current) {
      try {
        var img = current.getElementsByTagName("img")[0];
        img.onmouseenter = function () {
          onHover();
        }
        img.onmouseleave = function () {
          blur();
        }
      } catch (e) {
        console.log('can`t find image', e);
      }
    }
  });

  const [hoverTimeout, setHoverTimeout] = React.useState(-1 as number | NodeJS.Timeout);

  const onHover = () => {
    clearTimeout(hoverTimeout);
    
    const timeout = setTimeout(() => {
      try {
        const fileNameArr = containerRef.current?.getElementsByTagName('img')[0].getAttribute('src')?.split('/');
        if (fileNameArr) {
          const fileName = fileNameArr[fileNameArr.length - 1];
          const imageSource = containerRef.current?.getElementsByClassName('image-source')[0].innerHTML;
          hover(fileName, imageSource);
        }
      } catch {
        console.log('can`t get image. Error 14342');
      }
    }, 0);

    setHoverTimeout(timeout);
  }

  const onDoubleClick = () => {
    if (hovered) {
      blur();
    } else {
      onHover();
    }
  }

  if (isPhone()) {
    return <div key={index} className={className} dangerouslySetInnerHTML={{ __html: value }} />;
  } else if (isMobile) {
    // tablet can still zoom on double click
    return (
      <div>
        <div className="help-image-text-d43">
          <SpriteIcon name="f-zoom-in" />
          Double tap images to zoom.
        </div>
        <div
          key={index}
          ref={containerRef}
          className={className}
          dangerouslySetInnerHTML={{ __html: value }}
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
    )
  }

  return (
    <div>
      <div className="help-image-text-d43">
        <SpriteIcon name="f-zoom-in" />
        Hover over image to zoom
      </div>
      <div
        key={index}
        ref={containerRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: value }}
      />
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

export default connect(mapState, mapDispatch)(HtmlImageWithSpaces);
