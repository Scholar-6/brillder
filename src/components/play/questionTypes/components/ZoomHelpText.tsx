import React from 'react';
import { isPhone } from 'services/phone';
import {ReactComponent as DragIcon} from'assets/img/drag.svg';

const ZoomHelpText:React.FC = () => {
  return <p>
    <span className="help-text">
      <DragIcon />{isPhone() ? 'Double tap images to zoom.' : 'Hover over images to zoom.'}
    </span>
  </p>;
}

export default ZoomHelpText;
