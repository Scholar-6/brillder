import React from "react";

import './FirstButton.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User } from "model/user";
import map from "components/map";
import { isStudentPreference, isTeacherPreference } from "components/services/preferenceService";

interface FirstButtonProps {
  user: User;
  history: any;
  disabled?: boolean;
}

const FirstButton: React.FC<FirstButtonProps> = props => {
  const renderViewAllLabel = () => {
    const { rolePreference } = props.user;
    if (rolePreference) {
      if (isTeacherPreference(props.user)) {
        return "Assign Bricks";
      } else if (isStudentPreference(props.user)) {
        return "View & Play";
      }
    }
    return "View All Bricks";
  }

  let className = "view-item-container";
  if (props.disabled) {
    className += " disabled";
  } else {
    className += ' zoom-item'
  }

  return (
    <div
      className={className}
      onClick={() => {
        if (!props.disabled) {
          props.history.push(map.AllSubjects);
        }
      }}
    >
      <div className="eye-glass-icon">
        {/* <div className="svgOnHover">
          <SpriteIcon name="glasses-home" className="active text-theme-orange" />
        </div> */}
        <div className="eye-glass-frame svgOnHover">
          <SpriteIcon name="glasses-home" className="active text-theme-orange" />
        </div>
        <div className="glass-eyes-left svgOnHover">
          <SpriteIcon name="eye-ball" className="active eye-ball text-white" />
          <div className="glass-left-inside svgOnHover">
            {/* <SpriteIcon name="aperture" className="aperture" /> */}
            <SpriteIcon name="eye-pupil" className="eye-pupil" />
          </div>
        </div>
        <div className="glass-eyes-right svgOnHover">
          <SpriteIcon name="eye-ball" className="active eye-ball text-white" />
          <div className="glass-right-inside svgOnHover">
            {/* <SpriteIcon name="aperture" className="aperture" /> */}
            <SpriteIcon name="eye-pupil" className="eye-pupil" />
          </div>
        </div>
      </div>
      <span className="item-description">{renderViewAllLabel()}</span>
    </div>
  );
}

export default FirstButton;
