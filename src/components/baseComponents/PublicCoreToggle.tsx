import React from "react";
import sprite from "../../assets/img/icons-sprite.svg";

interface ToggleProps { }

const PublicCoreToggle: React.FC<ToggleProps> = (props) => {
  return (
    <div className="core-public-toggle">
      <button className="btn btn btn-transparent ">
        <span>Core</span>
        <div className="svgOnHover">
          <svg className="svg active selected">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#box"} className="text-theme-light-blue" />
          </svg>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#globe"} className="text-theme-light-blue" />
          </svg>
        </div>
        <span>Public</span>
      </button>
    </div>
  );
};

export default PublicCoreToggle;
