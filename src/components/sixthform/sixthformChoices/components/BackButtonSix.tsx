import React from 'react';
import { isPhone } from 'services/phone';

interface BackButtonProps {
  onClick(): void;
}

const BackButtonSix: React.FC<BackButtonProps> = (props) => {
  if (isPhone()) {
    return (
      <div className="bottom-back-btn-container">
        <div className="absolute-back-btn" onClick={props.onClick}>
          <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-16">Previous</span>
        </div>
      </div>
    );
  }
  return (
    <div className="absolute-back-btn" onClick={props.onClick}>
      <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-25">Previous</span>
    </div>
  );
}

export default BackButtonSix;
