import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { checkTeacherOrAdmin } from 'components/services/brickService';
import { User } from 'model/user';
import React from 'react';

interface ButtonProps {
  user: User;
  sidebarRolledUp: boolean;
  haveCircle?: boolean;
  onClick(): void;
}

const AdaptButton: React.FC<ButtonProps> = (props) => {
  const [hovered, setHover] = React.useState(false);

  if (!props.user) { return <span />; }
  let canSee = checkTeacherOrAdmin(props.user);
  if (!canSee) { return <span />; }

  if (!props.sidebarRolledUp) {
    return (
      <button onClick={props.onClick} className="assign-class-button svgOnHover blue">
        <span>Adapt Brick</span>
      </button>
    );
  }

  const renderTooltip = () => (
    <div className="custom-tooltip">
      <div>Adapt Brick</div>
    </div>
  );

  const renderCircle = () => (
    <div className="highlight-circle">
      <img alt="circle-border" className="highlight-circle dashed-circle" src="/images/borders/small-dash-circle.svg" />
      <span>Adapt Brick</span>
    </div>
  );

  return (
    <button
      onClick={props.onClick}
      className="assign-class-button adapt-small svgOnHover blue"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <SpriteIcon name="copy" className="active" />
      {hovered && renderTooltip()}
      {props.haveCircle && renderCircle()}
    </button>
  );
}

export default AdaptButton;
