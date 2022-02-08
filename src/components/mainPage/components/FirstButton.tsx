import React from "react";

import './FirstButton.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User } from "model/user";
import map from "components/map";
import { isStudentPreference, isTeacherPreference } from "components/services/preferenceService";
import { isPhone } from "services/phone";

interface FirstButtonProps {
  user: User;
  history: any;
  isNewTeacher?: boolean;
  disabled?: boolean;
}

const FirstButton: React.FC<FirstButtonProps> = props => {
  const renderViewAllLabel = () => {
    const { userPreference } = props.user;
    if (userPreference) {
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

  const link = React.useMemo(() => {
    let link = map.SubjectCategories;
    if (props.isNewTeacher) {
      link += '?' + map.NewTeachQuery;
    } if (props.user) {
      link = map.ViewAllPage + '?mySubject=true';
    }
    if (isPhone()) {
      return map.ViewAllPage;
    } else {
      return link;
    }
  }, [props.isNewTeacher, props.user]);

  return (
    <a
      href={window.location.origin + link}
      className={className}
      onClick={evt => {
        evt.preventDefault();
        props.history.push(link);
      }}
    >
      <div className="eye-glass-icon">
        <div className="eye-glass-frame svgOnHover">
          <SpriteIcon name="glasses-home" className="active text-theme-orange" />
        </div>
      </div>
      <span className="item-description">{renderViewAllLabel()}</span>
    </a>
  );
}

export default FirstButton;
