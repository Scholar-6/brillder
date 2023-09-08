import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import map from "components/map";
import React from "react";
import queryString from 'query-string';

import { TeachActiveTab } from "./model";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { ClassroomStatus } from "model/classroom";

interface TabProps {
  activeTab: TeachActiveTab;
  assignmentsEnabled: boolean;
  history: any;
  hideAssignButton?: boolean;
  classroom?: any;
  onAssign(): void;
}

const TeachTab: React.FC<TabProps> = ({ history, activeTab, classroom, assignmentsEnabled, hideAssignButton, onAssign }) => {
  const isActive = (t1: TeachActiveTab, t2: TeachActiveTab) => t1 === t2 ? 'active' : 'no-active';
  const values = queryString.parse(history.location.search);
  const classroomId = values.classroomId || '';
  const teacherId = values.teacherId || '';
  
  const [errorOpen, setErrorOpen] = React.useState(false);

  const prepareLink = (link: string) => classroomId ? (link + '?classroomId=' + classroomId) + '&teacherId=' + teacherId : link;

  const goToAssignments = React.useCallback(() => {
    if (assignmentsEnabled) {
      history.push(prepareLink(map.TeachAssignedTab));
    } else {
      setErrorOpen(true);
    }
    /*eslint-disable-next-line*/
  }, [assignmentsEnabled, history]);

  const assignedTab = () => {
    const className = isActive(activeTab, TeachActiveTab.Assignments);
    return (
      <div className={className} onClick={goToAssignments}>
        <div>
          <span>Assignments</span>
          {!hideAssignButton && classroom && classroom.status === ClassroomStatus.Active &&
          <div className="btn-assign" onClick={onAssign}>
            <div>Assign New Brick</div>
            <SpriteIcon name="plus-square"/>
          </div>}
        </div>
      </div>
    )
  }

  const manageClassesTab = () => {
    const className = isActive(activeTab, TeachActiveTab.Students);
    return (
      <div className={className} onClick={() => history.push(prepareLink(map.TeachAssignedTab))}>
        <div style={{display: 'flex'}}>
          <span>Learners</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-container">
      {assignedTab()}
      {manageClassesTab()}
      <ValidationFailedDialog header="You need to create a class or invite a pupil before managing assignments" isOpen={errorOpen} close={() => setErrorOpen(false)} />
    </div>
  )
}

export default TeachTab;
