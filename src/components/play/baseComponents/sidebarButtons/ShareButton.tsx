import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

import './ShareButton.scss';

interface ButtonProps {
  sidebarRolledUp: boolean;
  share(): void;
}

const ShareButton: React.FC<ButtonProps> = (props) => {
  const [hovered, setHover] = React.useState(false);

  if (!props.sidebarRolledUp) {
    return (
      <button onClick={props.share} className="assign-class-button share-button svgOnHover">
        <span>Share Brick</span>
      </button>
    );
  }

  const renderTooltip = () => {
    return (
      <div className="custom-tooltip">
        <div>Share Brick</div>
      </div>
    );
  }

  return (
    <button
      onClick={props.share}
      className="assign-class-button share-button svgOnHover"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <SpriteIcon name="feather-share" className="active" />
      {props.sidebarRolledUp && hovered && renderTooltip()}
    </button>
  );
}

export default ShareButton;
