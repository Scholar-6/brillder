import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

import { PlayMode } from '../../model';

interface ButtonProps {
  mode: PlayMode | undefined;
  sidebarRolledUp: boolean;
  haveCircle?: boolean;
  setHighlightMode(): void;
}

const HighlightTextButton: React.FC<ButtonProps> = (props) => {
  const [hovered, setHover] = React.useState(false);

  let className = "highlight-button svgOnHover";
  const { mode } = props;
  if (mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) {
    className += " active";
  }

  const renderHightlightText = () => {
    if (!props.sidebarRolledUp) {
      return <span>Highlight Text</span>;
    } else {
      return <span></span>;
    }
  }

  const renderTooltip = () => (
    <div className="custom-tooltip">
      <div>Highlight Text</div>
    </div>
  );

  const renderCircle = () => (
    <div className="highlight-circle">
      <img alt="circle-border" className="highlight-circle dashed-circle" src="/images/borders/small-dash-circle.svg" />
      <span>Highlight Text</span>
    </div>
  );

  return (
    <div
      className={className}
      onClick={props.setHighlightMode}
      onMouseLeave={() => setHover(false)} onMouseEnter={() => setHover(true)}
    >
      {renderHightlightText()}
      <SpriteIcon name="highlighter" className="active" />
      {props.sidebarRolledUp && hovered && renderTooltip()}
      {props.haveCircle && renderCircle()}
    </div>
  );
}

export default HighlightTextButton;
