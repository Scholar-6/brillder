import React from 'react';
import { connect } from 'react-redux';

import actions from 'redux/actions/play';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { isPhone } from 'services/phone';


interface SpacesProps {
  index: number;
  value: string;
  className?: string;

  hover: any;
  blur: any;
}

const HtmlImageWithSpaces: React.FC<SpacesProps> = ({ index, className, value, hover, blur }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onHover = () => {
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
  }

  if (isPhone()) {
    return <div key={index} className={className} dangerouslySetInnerHTML={{ __html: value }} />
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
        onMouseEnter={onHover}
        onMouseLeave={blur}
      />
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  hover: (fileName: string, imageSource: string) => dispatch(actions.setImageHover(fileName, imageSource)),
  blur: () => dispatch(actions.setImageBlur()),
});

export default connect(null, mapDispatch)(HtmlImageWithSpaces);
