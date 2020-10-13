import PrivateCoreToggle from "components/baseComponents/PrivateCoreToggle";
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

  isCore: boolean;
  onCoreSwitch(): void;
}

const TabComponent: React.FC<TabProps> = ({ isTeach, isCore, activeTab, setTab, onCoreSwitch }) => {
  return (
    <div className="tab-container">
      {isTeach &&
        <div
          className={activeTab === ActiveTab.Teach ? 'active' : ''}
          onClick={() => setTab(ActiveTab.Teach)}
        >
          <span>Teach</span>
        </div>
      }
      <div
        className={activeTab === ActiveTab.Build ? 'active' : ''}
        onClick={() => setTab(ActiveTab.Build)}
      >
        <div style={{display: 'flex'}}>
          <span>Build</span>
          <div className={!isTeach ? 'long toggle-button' : 'centered'}>
            <PrivateCoreToggle isCore={isCore} onSwitch={onCoreSwitch} />
          </div>
        </div>
      </div>
      <div
        className={activeTab === ActiveTab.Play ? 'active' : ''}
        onClick={() => setTab(ActiveTab.Play)}
      >
        <div style={{display: 'flex'}}>
          <span>Learn</span>
          <div className={!isTeach ? 'long toggle-button': 'centered'}>
            <PrivateCoreToggle isCore={isCore} onSwitch={onCoreSwitch} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabComponent;
