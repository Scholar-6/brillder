import React from "react";

import './FirstButton.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User, UserType } from "model/user";
import { isMobile } from "react-device-detect";
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
      const {roleId} = rolePreference;
      if (roleId === UserType.Teacher) {
        return "Assign Bricks";
      } else if (roleId === UserType.Student) {
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
          if (isMobile) {
            props.history.push("/play/dashboard/1");
          } else {
            props.history.push(map.AllSubjects);
          }
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
