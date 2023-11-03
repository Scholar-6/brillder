import React from 'react';

import './ReminderButton.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { TeachClassroom } from 'model/classroom';
import YesNoDialog from 'components/build/baseComponents/dialogs/YesNoDialog';

interface Props {
  studentCount: number;
  classroom?: TeachClassroom;
  sendNotifications(): void;
}

const ReminderButton: React.FC<Props> = (props) => {
  const [clicked, setClicked] = React.useState(false)
  const isPlural = props.studentCount > 1 ? true : false;
  return (
    <div className="reminder-brick-actions-container flex-center">
      <div className="reminder-button-container hover-area flex-center" onClick={() => setClicked(true)} >
        <SpriteIcon name="reminder" className="active reminder-icon" />
        <div className="hover-content bold">
          Send Reminder{isPlural ? 's' : ''}
        </div>
      </div>
      <YesNoDialog isOpen={clicked} title={`Send Reminder to ${props.studentCount} students`} submit={() => {
        props.sendNotifications();
        setClicked(false);
      }} close={() => setClicked(false)} />
    </div>
  );
}

export default ReminderButton;
