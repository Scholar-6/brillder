import React from 'react';
import { isPhone } from 'services/phone';
import {ReactComponent as DragIcon} from'assets/img/drag.svg';

const ZoomHelpText:React.FC = () => {
  return <p>
    <span className="help-text">
      <div style={{display: "none"}}>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
      <DragIcon />{isPhone() ? 'Double tap images to zoom.' : 'Hover over images to zoom.'}
    </span>
  </p>;
}

export default ZoomHelpText;
