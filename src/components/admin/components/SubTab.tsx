import React from "react";
import map from "components/map";
import { PDateFilter } from "../classesEvents/ClassesSidebar";

export enum ClassesActiveSubTab {
  Classes,
  Assignments,
}

interface TabProps {
  history: any;
  dateFilter: PDateFilter;
  activeTab: ClassesActiveSubTab;
}

const SubTab: React.FC<TabProps> = ({ activeTab, history, dateFilter }) => {
  const move = (path: string) => {
    let path2 = path;
    if (dateFilter) {
      path2 += '?dateFilter=' + dateFilter;
    }
    history.push(path2);
  }

  const classesSubTab = () => {
    let className = 'no-active';
    if (activeTab === ClassesActiveSubTab.Classes) {
      className = 'active';
    }
    return (
      <div className={className} onClick={() => move(map.ClassesEvents)}>
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
      <div className={className} onClick={() => move(map.AssignmentEvents)}>
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
  );
}

export default SubTab;
