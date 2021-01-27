import React from "react";

import "./CustomToggle.scss";
interface ToggleProps {
  onClick(): void;
  checked: boolean;
}

const CustomToggle: React.FC<ToggleProps> = (props) => {
  let className = "no-reverse"
  if (props.checked) {
    className = "reverse";
  }

  return (
    <div className="custom-toggle inner">
      <input type="checkbox" name="round" />
      <label onClick={props.onClick} className={className}>
        <svg viewBox="0 0 170 75">
          <path className="base-box" d="M158.6,37.5c0,13.8-11.2,25-25,25H36.4c-13.8,0-25-11.2-25-25l0,0c0-13.8,11.2-25,25-25h97.1
	C147.4,12.5,158.6,23.7,158.6,37.5L158.6,37.5z"/>
          <path className="box" d="M158.6,37.5c0,13.8-11.2,25-25,25H36.4c-13.8,0-25-11.2-25-25l0,0c0-13.8,11.2-25,25-25h97.1
	C147.4,12.5,158.6,23.7,158.6,37.5L158.6,37.5z"/>
        </svg>
      </label>
    </div>
  );
};

export default CustomToggle;
