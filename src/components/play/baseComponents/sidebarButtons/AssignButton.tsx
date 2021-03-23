import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { checkTeacherOrAdmin } from 'components/services/brickService';
import { User } from 'model/user';
import React from 'react';

interface ButtonProps {
  user: User;
  showBorder: boolean;
  sidebarRolledUp: boolean;
  openAssignDialog(): void;
}

const AssignButton: React.FC<ButtonProps> = (props) => {
  const [hovered, setHover] = React.useState(false);

  if (!props.user) { return <span></span>; }
  let canSee = checkTeacherOrAdmin(props.user);
  if (!canSee) { return <span></span>; }

  if (!props.sidebarRolledUp) {
    return (
      <button onClick={props.openAssignDialog} className="assign-class-button svgOnHover">
        <span>Assign Brick</span>
      </button>
    );
  }

  const renderTooltip = () => {
    return (
      <div className="custom-tooltip">
        <div>Assign Brick</div>
      </div>
    );
  }

  let className = 'assign-class-button assign-small svgOnHover';

  if (props.showBorder) {
    className += ' button-border';
  }

  return (
    <button
      onClick={props.openAssignDialog}
      className={className}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <div>
        <SpriteIcon name="file-plus" className="active" />
        {hovered && renderTooltip()}
      </div>
    </button>
  );
}

export default AssignButton;
