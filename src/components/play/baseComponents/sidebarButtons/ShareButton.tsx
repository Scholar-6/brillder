import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

interface ButtonProps {
  sidebarRolledUp: boolean;
  haveCircle?: boolean;
  share(): void;
}

const ShareButton: React.FC<ButtonProps> = (props) => {
  const [hovered, setHover] = React.useState(false);

  if (!props.sidebarRolledUp) {
    return (
      <div onClick={props.share} className="assign-class-button bigger-button-v3 share-button">
        <SpriteIcon name="share" />
        <span>Share</span>
      </div>
    );
  }

  const renderTooltip = () => (
    <div className="custom-tooltip bold">
      <div>Share Brick</div>
    </div>
  );

  const renderCircle = () => (
    <div className="highlight-circle share-circle">
      <img alt="circle-border" className="highlight-circle dashed-circle" src="/images/borders/small-dash-circle.svg" />
      <span>Share Brick</span>
    </div>
  );

  return (
    <button
      onClick={props.share}
      className="assign-class-button share-button svgOnHover"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <SpriteIcon name="feather-share" className="active" />
      {hovered && renderTooltip()}
      {props.haveCircle && renderCircle()}
    </button>
  );
}

export default ShareButton;
