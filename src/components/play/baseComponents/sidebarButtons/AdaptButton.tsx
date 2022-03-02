import React, { useEffect } from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { checkTeacherOrAdmin } from 'components/services/brickService';
import { isBuilderPreference } from 'components/services/preferenceService';
import { User } from 'model/user';
import { getAllClassrooms } from 'components/teach/service';


interface ButtonProps {
  user: User;
  sidebarRolledUp: boolean;
  haveCircle?: boolean;
  onClick(): void;
}

const AdaptButton: React.FC<ButtonProps> = (props) => {
  const [hovered, setHover] = React.useState(false);
  const [hassigned, setAssigned] = React.useState(false);

  const getAssigned = async () => {
    const classes = await getAllClassrooms();
    if (classes && classes.length > 0) {
      var classWithAssignments = classes.find(c => c.assignmentsCount && c.assignmentsCount > 0);
      if (classWithAssignments) {
        setAssigned(true);
      }
    }
  }

  useEffect(() => {
    getAssigned();
  }, []);

  if (!props.user) { return <span />; }
  console.log(hassigned);
  if (!hassigned) { return <span />; }

  const canSee = checkTeacherOrAdmin(props.user) || isBuilderPreference(props.user);
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

