import React from "react";
import map from "components/map";

export enum BricksActiveTab {
  Bricks,
  Classes,
  Users,
  Overview
}

interface TabProps {
  history: any;
  activeTab: BricksActiveTab;
}

const BricksTab: React.FC<TabProps> = ({ activeTab, history }) => {
  const overviewTab = () => {
    let className = 'no-active';
    if (activeTab === BricksActiveTab.Overview) {
      className = 'active';
    }
    return (
      <div className={className} onClick={() => history.push(map.AdminOverview)}>
        <div>
          <span>Overview</span>
        </div>
      </div>
    );
  }

  const bricksTab = () => {
    let className = 'no-active';
    if (activeTab === BricksActiveTab.Bricks) {
      className = 'active';
    }
    return (
      <div className={className} onClick={() => history.push(map.AdminBricksPlayed)}>
        <div>
          <span>Bricks</span>
        </div>
      </div>
    );
  }

  const classesTab = () => {
    let className = 'no-active';
    if (activeTab === BricksActiveTab.Classes) {
      className = 'active';
    }
    return (
      <div className={className} onClick={() => history.push(map.ClassesEvents)}>
        <div style={{ display: 'flex' }}>
          <span>Classes</span>
        </div>
      </div>
    );
  }

  const usersTab = () => {
    let className = 'no-active';
    if (activeTab === BricksActiveTab.Users) {
      className = 'active';
    }
    return (
      <div className={className} onClick={() => history.push(map.UsersEvents)}>
        <div style={{ display: 'flex' }}>
          <span>Users</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-container">
      {overviewTab()}
      {bricksTab()}
      {classesTab()}
      {usersTab()}
    </div>
  )
}

export default BricksTab;
