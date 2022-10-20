import React from "react";
import map from "components/map";

export enum ClassesActiveSubTab {
  Classes,
  Assignments,
}

interface TabProps {
  history: any;
  activeTab: ClassesActiveSubTab;
}

const SubTab: React.FC<TabProps> = ({ activeTab, history }) => {
  const classesSubTab = () => {
    let className = 'no-active';
    if (activeTab === ClassesActiveSubTab.Classes) {
      className = 'active';
    }
    return (
      <div className={className} onClick={() => history.push(map.ClassesEvents)}>
        <div>
          <span>CREATED CLASSES</span>
        </div>
      </div>
    );
  }

  const assignmentsSubTab = () => {
    let className = 'no-active';
    if (activeTab === ClassesActiveSubTab.Assignments) {
      className = 'active';
    }
    return (
      <div className={className} onClick={() => history.push(map.ClassesEvents)}>
        <div style={{display: 'flex'}}>
          <span>ASSIGNMENTS</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sub-tab-container">
      {classesSubTab()}
      {assignmentsSubTab()}
    </div>
  )
}

export default SubTab;
