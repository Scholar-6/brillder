import React from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { TeachClassroom } from 'model/classroom';
import { getTotalStudentsCount } from "../service/service";

interface Props {
  className: string;
  classroom?: TeachClassroom;
  sendNotifications(): void;
}

const ReminderButton: React.FC<Props> = (props) => {
  const realClassName = 'reminder-brick-actions-container completed ' + props.className;
  const isPlural = getTotalStudentsCount(props.classroom) > 1 ? true : false;
  return (
    <div className={realClassName}>
      <div className="reminder-button-container" onClick={props.sendNotifications} >
        <div className="green-hover">
          <div />
        </div>
        <SpriteIcon name="reminder" className="active reminder-icon reminder-icon2" />
      </div>
      <div className="css-custom-tooltip">
        Send Reminder{isPlural ? 's' : ''}
      </div>
    </div>
  );
}

export default ReminderButton;
