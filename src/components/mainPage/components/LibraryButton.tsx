import React from "react";
import { isMobile } from "react-device-detect";
import './LibraryButton.scss';

interface ButtonProps {
  history: any;
  isMobile?: boolean;
  isActive: boolean;
  isSwiping: boolean;
  onClick(): void;
  onMobileClick(): void;
}

const LibraryButton: React.FC<ButtonProps> = props => {
  const {isActive} = props;

  const renderLibraryIcon = () => {
    return (
      <svg viewBox="0 0 163.991 148.79" className="book-svg-icon" stroke="currentColor">
        <g transform="translate(-878.008 -684)">
          <path d="M3,4.5H48.6a30.4,30.4,0,0,1,30.4,30.4V141.29a22.8,22.8,0,0,0-22.8-22.8H3Z" transform="translate(881.008 685.5)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
          <path d="M93.995,4.5H48.4A30.4,30.4,0,0,0,18,34.9V141.29a22.8,22.8,0,0,1,22.8-22.8h53.2Z" transform="translate(942.004 685.5)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
          <path className="third-line" d="M27,41.335V15" transform="translate(986.602 724.134)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"/>
          <path className="second-line" d="M18,48.135V6" transform="translate(979.801 717.333)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"/>
          <path className="first-line" d="M9 36 l 0 -42" transform="translate(973 728.668)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"/>
        </g>
      </svg>
    );
  }

  const onClick = () => {
    if (isActive) { 
      props.history.push('/my-library');
    } else {
      props.onClick();
    }
  }

  let className = 'btn btn-transparent';
  if (isActive) {
    className += ' active zoom-item text-theme-orange svgOnHover';
  } else {
    className += ' text-theme-dark-blue';
  }

  return (
    <div className="my-library-button" onClick={onClick}>
      <button className={className}>
        {renderLibraryIcon()}
        <div>
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>My Library</span>
        </div>
      </button>
    </div>
  );
}

export default LibraryButton;
