import React from "react";

export enum ActiveTab {
  Play,
  Build,
  Teach
}

interface TabProps {
  isTeach: boolean;
  activeTab: ActiveTab;
  setTab(tab: ActiveTab): void;
}

const TabComponent: React.FC<TabProps> = ({ isTeach, activeTab, setTab }) => {
  return (
    <div className="tab-container">
      {isTeach ?
        <div
          className={activeTab === ActiveTab.Teach ? 'active' : ''}
          onClick={() => setTab(ActiveTab.Teach)}
        >
          <span>Teach</span>
        </div> : ""
      }
      <div
        className={activeTab === ActiveTab.Build ? 'active' : ''}
        onClick={() => setTab(ActiveTab.Build)}
      >
        <span>Build</span>
      </div>
      <div
        className={activeTab === ActiveTab.Play ? 'active' : ''}
        onClick={() => setTab(ActiveTab.Play)}
      >
        <span>Learn</span>
      </div>
    </div>
  )
}

export default TabComponent;
