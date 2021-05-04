import React from "react";
import DynamicFont from 'react-dynamic-font';

import "./BellButton.scss";
import { isPhone } from "services/phone";

interface BellButtonProps {
  notificationCount: number;
  onClick(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}

const BellButton: React.FC<BellButtonProps> = (props) => {
  const {notificationCount} = props;
  let className = "header-btn bell-button svgOnHover rotate animated";
  if (notificationCount !== 0) {
    className += " bell-full";
  }

  if (!isPhone()) {
    className += ' big-version'
  }

  const renderCount = () => {
    if (notificationCount <= 0) { return ""; }
 
      return (
        <div className="bell-circle">
          {!isPhone() && <DynamicFont content={notificationCount.toString()} />}
        </div>
      );
  }


  return (
    <div
      id="bell-container"
      className={className}
      onClick={props.onClick}
    >
      <svg id="bell" viewBox="0 0 24 24">
        <path
          className="bell-cup"
          d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {renderCount()}
    </div>
  );
};

export default BellButton;
