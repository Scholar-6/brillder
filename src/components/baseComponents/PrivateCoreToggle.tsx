import React from "react";

import sprite from "assets/img/icons-sprite.svg";
import './PrivateCoreToggle.scss';

interface ToggleProps {
  notVisible?: boolean;
  isCore: boolean;
  onSwitch(): void;
}

const PrivateCoreToggle: React.FC<ToggleProps> = props => {
  const {isCore} = props;

  const renderCoreIcon = () => {
    let className = "svg active";
    if (isCore) {
      className += " selected";
    }
    return (
      <svg className={className}>
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#box"} />
      </svg>
    );
  }

  const renderPrivateIcon = () => {
    let className = "svg active";
    if (!isCore) {
      className += " selected";
    }
    return (
      <svg className={className}>
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#user"} />
      </svg>
    );
  }

  if (props.notVisible) {
    return <div></div>;
  }

  return (
    <div className="private-core-toggle">
      <button className="btn btn btn-transparent ">
        <span className={isCore ? 'bold' : 'regular'}>Core</span>
        <div className="svgOnHover" onClick={props.onSwitch}>
          {renderCoreIcon()}
          {renderPrivateIcon()}
        </div>
        <span className={!isCore ? 'bold' : 'regular'}>Private</span>
      </button>
    </div>
  );
};

export default PrivateCoreToggle;
