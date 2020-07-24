import React from "react";
import sprite from "../../assets/img/icons-sprite.svg";

interface ToggleProps {
  isCore: boolean;
}

const PublicCoreToggle: React.FC<ToggleProps> = ({ isCore }) => {

  const renderCoreIcon = () => {
    let className = "svg active";
    if (isCore) {
      className += " selected";
    }
    return (
      <svg className={className}>
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#box"} className="text-light-blue2" />
      </svg>
    );
  }

  const renderPublicIcon = () => {
    let className = "svg active";
    if (!isCore) {
      className += " selected";
    }
    return (
      <svg className={className}>
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#globe"} className="text-light-blue2" />
      </svg>
    );
  }

  return (
    <div className="core-public-toggle">
      <button className="btn btn btn-transparent ">
        <span className={isCore ? 'bold' : 'regular'}>Core</span>
        <div className="svgOnHover">
          {renderCoreIcon()}
          {renderPublicIcon()}
        </div>
        <span className={!isCore ? 'bold' : 'regular'}>Public</span>
      </button>
    </div>
  );
};

export default PublicCoreToggle;
