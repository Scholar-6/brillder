import React from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { User, UserType } from "model/user";

import PrivateCoreToggle from "components/baseComponents/PrivateCoreToggle";

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

  //redux
  user: User;
}

const TabComponent: React.FC<TabProps> = ({ isTeach, isCore, activeTab, user, setTab, onCoreSwitch }) => {
  const tabs:any[] = [];

  const isActive = (t1: ActiveTab, t2: ActiveTab) => t1 === t2 ? 'active' : '';

  const getTeachTab = () => {
    const className = isActive(activeTab, ActiveTab.Teach);
    return (
      <div key={1} className={className} onClick={() => setTab(ActiveTab.Teach)}>
        <span>Teach</span>
      </div>
    )
  }

  const getBuildTab = () => {
    const className = isActive(activeTab, ActiveTab.Build);
    return (
      <div key={2} className={className} onClick={() => setTab(ActiveTab.Build)}>
        <div style={{display: 'flex'}}>
          <span>Build</span>
          <div className={!isTeach ? 'long toggle-button' : 'centered'}>
            <PrivateCoreToggle isCore={isCore} onSwitch={onCoreSwitch} />
          </div>
        </div>
      </div>
    );
  }

  const getLearnTab = () => {
    const className = isActive(activeTab, ActiveTab.Play);
    return (
      <div key={3} className={className} onClick={() => setTab(ActiveTab.Play)}>
        <div style={{display: 'flex'}}>
          <span>Learn</span>
          <div className={!isTeach ? 'long toggle-button': 'centered'}>
            <PrivateCoreToggle isCore={isCore} onSwitch={onCoreSwitch} />
          </div>
        </div>
      </div>
    );
  }

  if (isTeach) {
    tabs.push(getTeachTab());
  }
  console.log(user.rolePreference);
  if (user.rolePreference?.roleId === UserType.Student) {
    tabs.push(getLearnTab());
    tabs.push(getBuildTab());
  } else {
    tabs.push(getBuildTab());
    tabs.push(getLearnTab());
  }

  return (
    <div className="tab-container">
      {tabs}
    </div>
  )
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(TabComponent);
