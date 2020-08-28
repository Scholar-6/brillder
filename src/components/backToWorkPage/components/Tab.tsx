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
          Teach
        </div> : ""
      }
      <div
        className={activeTab === ActiveTab.Build ? 'active' : ''}
        onClick={() => setTab(ActiveTab.Build)}
      >
        Build
      </div>
      <div
        className={activeTab === ActiveTab.Play ? 'active' : ''}
        onClick={() => setTab(ActiveTab.Play)}
      >
        Play
      </div>
    </div>
  )
}

export default TabComponent;
