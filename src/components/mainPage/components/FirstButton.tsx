import React from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { RolePreference, User } from "model/user";
import map from "components/map";

interface FirstButtonProps {
  user: User;
  history: any;
  disabled?: boolean;
}

const FirstButton: React.FC<FirstButtonProps> = props => {
  const renderViewAllLabel = () => {
    const { rolePreference } = props.user;
    if (rolePreference) {
      const { roleId } = rolePreference;
      if (roleId === RolePreference.Teacher) {
        return "Assign Bricks";
      } else if (roleId === RolePreference.Student) {
        return "View & Play";
      }
    }
    return "View All Bricks";
  }

  return (
    <div
      className="view-item-container zoom-item"
      onClick={() => {
        if (!props.disabled) {
          props.history.push(map.AllSubjects);
        }
      }}
    >
      <div className="eye-glass-icon">
        <div className="eye-glass-frame svgOnHover">
          <SpriteIcon name="glasses-home" className="active text-theme-orange" />
        </div>
        <div className="glass-eyes-left svgOnHover">
          <SpriteIcon name="eye-ball" className="eye-ball text-white" />
          <div className="glass-left-inside">
            <SpriteIcon name="eye-pupil" className="eye-pupil text-theme-dark-blue" />
            {/* <SpriteIcon name="aperture" className="aperture text-theme-dark-blue" /> */}
          </div>
        </div>
        <div className="glass-eyes-right svgOnHover">
          <SpriteIcon name="eye-ball" className="eye-ball text-white" />
          <div className="glass-right-inside">
            <SpriteIcon name="eye-pupil" className="eye-pupil text-theme-dark-blue" />
            {/* <SpriteIcon name="aperture" className="aperture text-theme-dark-blue" /> */}
          </div>
        </div>
      </div>
      <span className="item-description">{renderViewAllLabel()}</span>
    </div>
  );
}

export default FirstButton;
