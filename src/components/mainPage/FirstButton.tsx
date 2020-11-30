import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User, UserType } from "model/user";
import React from "react";
import { isMobile } from "react-device-detect";
import './FirstButton.scss';

interface FirstButtonProps {
  user: User;
  history: any;
  disabled?: boolean;
}

const FirstButton: React.FC<FirstButtonProps> = props => {
  let [afterHover, setAfterHover] = React.useState(false);
  let [hovered, setHover] = React.useState(false);
  let [t, setT] = React.useState(null as any);
  const setPostHover = () => {
    setHover(true);
    if (t) {
      clearTimeout(t);
    }
    let timeout = setTimeout(() => {
      setAfterHover(true);
    }, 2000);
    setT(timeout);
  }

  const removeHover = () => {
    if (t) {
      setHover(false);
      setAfterHover(false);
      clearTimeout(t);
    }
  }

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
      onMouseEnter={setPostHover}
      onMouseLeave={removeHover}
      onClick={() => {
        if (!props.disabled) {
          if (isMobile) {
            props.history.push("/play/dashboard/1");
          } else {
            props.history.push("/play/dashboard");
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
          {!afterHover ?
            <div className="glass-left-pupil">
              <svg className="svg active" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path fill="#001C55" className="pupil" d="M13.1,12c0,2.1-1.7,3.8-3.8,3.8S5.5,14.1,5.5,12s1.7-3.8,3.8-3.8S13.1,9.9,13.1,12L13.1,12z" />
              </svg>
            </div>
            : 
            <div className="glass-left-inside">
              <SpriteIcon name="aperture" className="aperture" />
            </div>
          }
        </div>
        <div className="glass-eyes-right svgOnHover">
          <svg className="svg active" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path fill="#F5F6F7" className="eyeball" d="M2,12c0,0,3.6-7.3,10-7.3S22,12,22,12s-3.6,7.3-10,7.3S2,12,2,12z" />
          </svg>
          {!afterHover ? 
            <div className="glass-right-pupil">
              <svg className="svg active" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path fill="#001C55" className="pupil" d="M13.1,12c0,2.1-1.7,3.8-3.8,3.8S5.5,14.1,5.5,12s1.7-3.8,3.8-3.8S13.1,9.9,13.1,12L13.1,12z" />
              </svg>
            </div>
            :
            <div className="glass-right-inside">
              <SpriteIcon name="aperture" className="aperture" />
            </div>
          }
        </div>
      </div>
      <span className="item-description">{renderViewAllLabel()}</span>
    </div>
  );
}

export default FirstButton;
