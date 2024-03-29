import React from "react";

import './Warning.scss';
import SpriteIcon from "../SpriteIcon";

interface Props {}

const Warning: React.FC<Props> = (props) => {
  return (
    <div className="rotate-instruction-page ipad-warning">
      <div>
        <div className="rotate-button-container">
          <SpriteIcon name="alert-triangle" />
        </div>
        <div className="rotate-text">Hold tight, Brillder is coming soon on iPad.</div>
      </div>
    </div>
  );
}

export default Warning;
