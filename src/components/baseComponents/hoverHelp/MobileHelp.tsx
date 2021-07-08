import React from 'react';
import SpriteIcon from '../SpriteIcon';
import './MobileHelp.scss';

const MobileHelp: React.FC<any> = (props) => {
  const [active, setActive] = React.useState(false);

  return (
    <div className="va-hover-area custom">
      <SpriteIcon name="help-circle-custom" onClick={() => setActive(true)} />
      {active &&
        <div className="va-background" onClick={() => setActive(false)}>
          <div className="va-hover-content">
            <div className="va-container">
              {props.children}
            </div>
          </div>
        </div>}
    </div>
  );
}

export default MobileHelp;
