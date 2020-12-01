import map from "components/map";
import React from "react";

import { TeachActiveTab } from "./model";

interface TabProps {
  activeTab: TeachActiveTab;
  history: any;
}

const TeachTab: React.FC<TabProps> = ({ history, activeTab }) => {
  const isActive = (t1: TeachActiveTab, t2: TeachActiveTab) => t1 === t2 ? 'active' : 'no-active';

  const assignedTab = () => {
    const className = isActive(activeTab, TeachActiveTab.Assignments);
    return (
      <div className={className} onClick={() => history.push(map.TeachAssignedTab)}>
        <div>
          <span>Assignments</span>
        </div>
      </div>
    )
  }

  const manageClassesTab = () => {
    const className = isActive(activeTab, TeachActiveTab.Students);
    return (
      <div className={className} onClick={() => history.push(map.ManageClassroomsTab)}>
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
    </div>
  )
}

export default TeachTab;
