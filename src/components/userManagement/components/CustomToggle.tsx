import React, { useState } from "react";
import ActivateAccountDialog from "./ActivateAccountDialog";

import "./CustomToggle.scss";
interface ToggleProps {
  onClick(): void;
  name: string;
  checked: boolean;
}

const CustomToggle: React.FC<ToggleProps> = (props) => {
  const [isOpen, setOpen] = useState(false);

  let className = "no-reverse"
  if (props.checked) {
    className = "reverse";
  }

  return (
    <div className="custom-toggle inner">
      <input type="checkbox" name="round" />
      <label onClick={() => setOpen(true)} className={className}>
        <svg viewBox="0 0 170 75">
          <path className="base-box" d="M158.6,37.5c0,13.8-11.2,25-25,25H36.4c-13.8,0-25-11.2-25-25l0,0c0-13.8,11.2-25,25-25h97.1
	C147.4,12.5,158.6,23.7,158.6,37.5L158.6,37.5z"/>
          <path className="box" d="M158.6,37.5c0,13.8-11.2,25-25,25H36.4c-13.8,0-25-11.2-25-25l0,0c0-13.8,11.2-25,25-25h97.1
	C147.4,12.5,158.6,23.7,158.6,37.5L158.6,37.5z"/>
        </svg>
      </label>
      {isOpen && <ActivateAccountDialog
        isOpen={isOpen}
        title={(props.checked ? 'Deactivate ' : 'Activate ') + props.name + "?"}
        submit={() => {
          props.onClick();
          setOpen(false);
        }}
        close={() => setOpen(false)}
      />}
    </div>
  );
};

export default CustomToggle;


