import React, { useEffect } from 'react';
import queryString from 'query-string';
// @ts-ignore
import { Steps } from 'intro.js-react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { checkTeacherOrAdmin } from 'components/services/brickService';
import { User } from 'model/user';

interface ButtonProps {
  user: User;
  history:any;
  haveCircle?: boolean;
  sidebarRolledUp: boolean;
  openAssignDialog(): void;
}

const AssignButton: React.FC<ButtonProps> = (props) => {
  const [hovered, setHover] = React.useState(false);
  const [isNewTeacher, setNewTeacher] = React.useState(false);

  const steps = [{
    element: '.assign-intro-button',
    intro: `<p>Click to assign this brick to a new class or individual</p>`,
  },{
    element: '.assign-intro-button',
    intro: `<p>Click to assign this brick to a new class or individual</p>`,
  }];

  useEffect(() => {
    const values = queryString.parse(props.history.location.search);
    if (values.newTeacher) {
      setTimeout(() => {
        setNewTeacher(true);
      }, 1000);
    }
  /*eslint-disable-next-line*/
  }, []);
  
  if (!props.user) { return <span></span>; }
  let canSee = checkTeacherOrAdmin(props.user);
  if (!canSee) { return <span></span>; }

  const onIntroChanged = (e: any) => {
    if (e !== 0) {
      setNewTeacher(false);
      props.openAssignDialog();
    }
  }

  const onIntroExit = (e: any) => {
    setNewTeacher(false);
  }

  if (!props.sidebarRolledUp) {
    return (
      <button onClick={props.openAssignDialog} className={`assign-class-button assign-intro-button svgOnHover ${isNewTeacher ? 'bordered' : ''}`}>
        <span>Assign Brick</span>
        {isNewTeacher &&
        <Steps
          enabled={true}
          steps={steps}
          initialStep={0}
          onChange={onIntroChanged}
          onExit={onIntroExit}
          onComplete={props.openAssignDialog}
        />}
      </button>
    );
  }

  const renderTooltip = () => (
    <div className="custom-tooltip bold">
      <div>Assign Brick</div>
    </div>
  );

  const renderCircle = () => (
    <div className="highlight-circle assign-circle">
      <img alt="circle-border" className="highlight-circle dashed-circle" src="/images/borders/small-dash-circle.svg" />
      <span>Assign Brick</span>
    </div>
  )

  return (
    <button
      onClick={props.openAssignDialog}
      className="assign-class-button assign-small svgOnHover"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <SpriteIcon name="file-plus" className="active" />
      {hovered && renderTooltip()}
      {props.haveCircle && renderCircle()}
    </button>
  );
}

export default AssignButton;
