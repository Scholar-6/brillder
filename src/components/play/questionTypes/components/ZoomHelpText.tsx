import React from 'react';
import { isPhone } from 'services/phone';

const ZoomHelpText:React.FC = () => {
  return <p>
    <span className="help-text">
      {isPhone() ? 'Double tap images to zoom' : 'Hover over images to zoom.'}
    </span>
  </p>;
}

export default ZoomHelpText;
