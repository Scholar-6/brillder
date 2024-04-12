import React from 'react';
import { isPhone } from 'services/phone';

interface BackButtonProps {
  label: string;
  disabled?: boolean;
  onClick(): void;
}

const NextButtonSix: React.FC<BackButtonProps> = (props) => {
  if (isPhone()) {
    return (
      <div className="bottom-next-btn-container">
        <button className={`absolute-contunue-btn font-20 ${props.disabled ? "disabled" : ""}`} onClick={props.onClick}>
          {props.label}
        </button>
      </div>
    );
  }

  return (
    <button className={`absolute-contunue-btn font-24 ${props.disabled ? "disabled" : ""}`} onClick={props.onClick}>
      {props.label}
    </button>
  );
}

export default NextButtonSix;
