import React from "react";

import "./CustomToggle.scss";
interface ToggleProps {
  onClick(): void;
  checked: boolean;
}

const CustomToggle: React.FC<ToggleProps> = (props) => {
  let className = "no-reverse"
  if (props.checked) {
    className="reverse";
  }

  return (
    <div className="custom-toggle inner">
      <input type="checkbox" name="round" />
      <label onClick={props.onClick} className={className}>
        <svg viewBox="0 0 179.333 61.333">
          <path
            className="box"
            d="M153.142,30.81 c0,13.807-11.192,25-25,25H31c-13.807,0-25-11.193-25-25l0,0c0-13.807,11.193-25,25-25h97.143
               C141.95,5.81,153.142,17.002,153.142,30.81L153.142,30.81z"
          />
        </svg>
      </label>
    </div>
  );
};

export default CustomToggle;
