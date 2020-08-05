import React from "react";

interface BellButtonProps {
  notificationCount: number;
  onClick(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}

const BellButton: React.FC<BellButtonProps> = (props) => {
  const {notificationCount} = props;
  return (
    <div
      className="header-btn bell-button svgOnHover"
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
