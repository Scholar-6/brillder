import React from "react";
import { TeachActiveTab } from "./interface";


interface TabProps {
  activeTab: TeachActiveTab;
  setTab(tab: TeachActiveTab): void;
}

const TeachTabComponent: React.FC<TabProps> = ({ activeTab, setTab }) => {
  const isActive = (t1: TeachActiveTab, t2: TeachActiveTab) => t1 === t2 ? 'active' : '';

  const getAssignmentsTab = () => {
    const className = isActive(activeTab, TeachActiveTab.Assignments);
    return (
      <div key={1} className={className} onClick={() => setTab(TeachActiveTab.Assignments)}>
        <div>
          <span>Assignments</span>
        </div>
      </div>
    )
  }

  const getStudentsTab = () => {
    const className = isActive(activeTab, TeachActiveTab.Students);
    return (
      <div key={2} className={className} onClick={() => setTab(TeachActiveTab.Students)}>
        <div style={{display: 'flex'}}>
          <span>Students</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-container">
      {getAssignmentsTab()}
      {getStudentsTab()}
    </div>
  )
}

export default TeachTabComponent;
