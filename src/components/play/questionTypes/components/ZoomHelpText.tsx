import React from 'react';
import {ReactComponent as DragIcon} from'assets/img/drag.svg';
import { isMobile } from 'react-device-detect';

const ZoomHelpText:React.FC = () => {
  return <p>
    <span className="help-text">
      <DragIcon />{isMobile ? 'Double tap images to zoom.' : 'Hover over images to zoom.'}
    </span>
  </p>;
}

export default ZoomHelpText;
