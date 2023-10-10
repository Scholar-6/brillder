import React, { useEffect } from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { checkEditor, checkTeacherOrAdmin } from 'components/services/brickService';
import { isBuilderPreference } from 'components/services/preferenceService';
import { User } from 'model/user';
import { getAllClassrooms } from 'components/teach/service';


interface ButtonProps {
  user: User;
  sidebarRolledUp: boolean;
  hasAssignment?: boolean;
  haveCircle?: boolean;
  onClick(): void;
}

const AdaptButton: React.FC<ButtonProps> = (props) => {
  const [hovered, setHover] = React.useState(false);

  let canSee = false;

  if (props.user) {
    const isPublisher = checkEditor(props.user.roles);
    if (isPublisher) {
      canSee = true;
    } else if (checkTeacherOrAdmin(props.user) || isBuilderPreference(props.user)) {
      canSee = true;
    } else if (props.hasAssignment) {
      canSee = true;
    }
  }

  if (!canSee) { return <span />; }

  if (!props.sidebarRolledUp) {
    return (
      <div onClick={props.onClick} className="assign-class-button bigger-button-v3 blue-v3">
        <SpriteIcon name="copy" />
        <div>Adapt</div>
      </div>
    );
  }

  const renderTooltip = () => (
    <div className="custom-tooltip bold">
      <div>Adapt Brick</div>
    </div>
  );

  const renderCircle = () => (
    <div className="highlight-circle adapt-circle">
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

