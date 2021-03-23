import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { checkTeacherOrAdmin } from 'components/services/brickService';
import { User } from 'model/user';
import React from 'react';

interface ButtonProps {
  user: User;
  sidebarRolledUp: boolean;
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

  const renderTooltip = () => {
    return (
      <div className="custom-tooltip">
        <div>Adapt Brick</div>
      </div>
    );
  }

  return (
    <button
      onClick={props.onClick}
      className="assign-class-button adapt-small svgOnHover blue"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <SpriteIcon name="copy" className="active" />
      {hovered && renderTooltip()}
    </button>
  );
}

export default AdaptButton;
