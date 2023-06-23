import React, { useEffect } from 'react';
import queryString from 'query-string';
import { connect } from "react-redux";

import { User } from 'model/user';
import { Brick } from 'model/brick';
import { checkTeacherOrAdmin } from 'components/services/brickService';
import { ClassroomApi, createClass } from 'components/teach/service';
import { AssignClassData, assignClasses } from 'services/axios/assignBrick';
import playActions from 'redux/actions/play';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import QuickAssignDialog from 'components/baseComponents/dialogs/QuickAssignDialog';
import { ReduxCombinedState } from 'redux/reducers';


interface ButtonProps {
  user: User;
  brick: Brick;
  history: any;
  haveCircle?: boolean;
  sidebarRolledUp: boolean;
  quickAssignPopup: boolean;
  setQuickAssignPopup(isOpen: boolean): void;
  showPremium(): void;
}

const QuickAssignButton: React.FC<ButtonProps> = (props) => {
  const [isOpening, setOpening] = React.useState(false);
  const [newClassroom, setNewClass] = React.useState(null as ClassroomApi | null);
  const [hovered, setHover] = React.useState(false);
  const [isNewTeacher, setNewTeacher] = React.useState(false);

  useEffect(() => {
    const values = queryString.parse(props.history.location.search);
    if (values.newTeacher) {
      setTimeout(() => {
        setNewTeacher(true);
      }, 1000);
    }
    /*eslint-disable-next-line*/
  }, []);

  // creating class and assignment
  const openQuickAssignment = async () => {
    setOpening(true);
    if (isOpening) {
      return;
    }
    const {brick} = props;
    const newClassroom = await createClass(brick.title);
    if (newClassroom) {
      setNewClass(newClassroom);
      const res = await assignClasses(brick.id, { classesIds: [newClassroom.id]} as AssignClassData);
      if (res.success) {
        props.setQuickAssignPopup(true);
      }
      setOpening(false);
    } else {
      console.log('can`t create class');
    }
  }

  if (!props.user) { return <span></span>; }
  let canSee = checkTeacherOrAdmin(props.user);
  if (!canSee) { return <span></span>; }

  const renderPopup = () => {
    return (
      <QuickAssignDialog
        isOpen={props.quickAssignPopup}
        user={props.user}
        classroom={newClassroom}
        close={() => props.setQuickAssignPopup(false)}
      />
    )
  }

  const renderTooltip = () => (
    <div className="custom-tooltip bold">
      <div>Quick Assign Brick</div>
    </div>
  );

  const renderCircle = () => (
    <div className="highlight-circle assign-circle">
      <img alt="circle-border" className="highlight-circle dashed-circle" src="/images/borders/small-dash-circle.svg" />
      <span>Assign Brick</span>
    </div>
  )

  if (!props.sidebarRolledUp) {
    return (
      <div>
        <div onClick={openQuickAssignment} className={`assign-class-button quick-assign-button bigger-button-v3 assign-intro-button ${isNewTeacher ? 'bordered' : ''}`}>
          <SpriteIcon name="file-plus" />
          <div>Quick Assign</div>
        </div>
        {renderPopup()}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={openQuickAssignment}
        className="assign-class-button assign-small svgOnHover"
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      >
        <SpriteIcon name="file-plus" className="active" />
        {hovered && renderTooltip()}
        {props.haveCircle && renderCircle()}
      </button>
      {renderPopup()}
    </div>
  );
}


const mapState = (state: ReduxCombinedState) => ({
  quickAssignPopup: state.play.quickAssignPopup,
});

const mapDispatch = (dispatch: any) => ({
  setQuickAssignPopup: (isOpen: boolean) => dispatch(playActions.setQuickAssignPopup(isOpen)),
});

const connector = connect(mapState, mapDispatch);

export default connector(QuickAssignButton);
