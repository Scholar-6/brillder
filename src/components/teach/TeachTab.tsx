import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import map from "components/map";
import React from "react";
import queryString from 'query-string';

import { TeachActiveTab } from "./model";

interface TabProps {
  activeTab: TeachActiveTab;
  assignmentsEnabled: boolean;
  history: any;
}

const TeachTab: React.FC<TabProps> = ({ history, activeTab, assignmentsEnabled }) => {
  const isActive = (t1: TeachActiveTab, t2: TeachActiveTab) => t1 === t2 ? 'active' : 'no-active';
  const values = queryString.parse(history.location.search);
  const classroomId = values.classroomId || '';
  
  const [errorOpen, setErrorOpen] = React.useState(false);

  const prepareLink = (link: string) => classroomId ? (link + '?classroomId=' + classroomId) : link;

  const goToAssignments = React.useCallback(() => {
    if (assignmentsEnabled) {
      history.push(prepareLink(map.TeachAssignedTab));
    } else {
      setErrorOpen(true);
    }
  }, [assignmentsEnabled, history]);

  const assignedTab = () => {
    const className = isActive(activeTab, TeachActiveTab.Assignments);
    return (
      <div className={className} onClick={goToAssignments}>
        <div>
          <span>Assignments</span>
        </div>
      </div>
    )
  }

  const manageClassesTab = () => {
    const className = isActive(activeTab, TeachActiveTab.Students);
    return (
      <div className={className} onClick={() => history.push(prepareLink(map.ManageClassroomsTab))}>
        <div style={{display: 'flex'}}>
          <span>Students</span>
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
