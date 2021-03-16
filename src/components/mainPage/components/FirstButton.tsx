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
        <div className="svgOnHover">
          <SpriteIcon name="glasses-home" className="active text-theme-orange" />
        </div>
        <div className="glass-eyes-left svgOnHover">
          <svg className="svg active" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path fill="#F5F6F7" className="eyeball" d="M2,12c0,0,3.6-7.3,10-7.3S22,12,22,12s-3.6,7.3-10,7.3S2,12,2,12z" />
          </svg>
          <div className="glass-left-inside">
            <SpriteIcon name="aperture" className="aperture" />
          </div>
        </div>
        <div className="glass-eyes-right svgOnHover">
          <svg className="svg active" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path fill="#F5F6F7" className="eyeball" d="M2,12c0,0,3.6-7.3,10-7.3S22,12,22,12s-3.6,7.3-10,7.3S2,12,2,12z" />
          </svg>
          <div className="glass-right-inside">
            <SpriteIcon name="aperture" className="aperture" />
          </div>
        </div>
      </div>
      <span className="item-description">{renderViewAllLabel()}</span>
    </div>
  );
}

export default FirstButton;
