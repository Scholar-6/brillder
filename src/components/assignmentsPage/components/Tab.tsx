import React from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { User } from "model/user";


interface TabProps {
  isTeach: boolean;
  isCore: boolean;
  onCoreSwitch(): void;

  //redux
  user: User;
}

const TabComponent: React.FC<TabProps> = ({ isTeach, isCore, user, onCoreSwitch }) => {
  const publicClass = () => isCore ? 'active' : 'no-active';
  const personalClass = () => !isCore ? 'active' : 'no-active';

  const getPublicTab = () => {
    const className = publicClass();
    return (
      <div key={2} className={className} onClick={onCoreSwitch}>
        <div style={{display: 'flex'}}>
          <span>Public</span>
        </div>
      </div>
    );
  }

  const getPersonalTab = () => {
    const className = personalClass();
    return (
      <div key={3} className={className} onClick={onCoreSwitch}>
        <div style={{display: 'flex'}}>
          <span>Personal</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-container">
      {getPublicTab()}
      {getPersonalTab()}
    </div>
  )
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(TabComponent);
