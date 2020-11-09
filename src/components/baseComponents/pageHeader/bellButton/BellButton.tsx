import React from "react";

import "./BellButton.scss";

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
      {notificationCount !== 0 && (<span className="bell-text">{notificationCount}</span>)}
    </div>
  );
};

export default BellButton;
