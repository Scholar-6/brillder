import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TimeDropdowns from 'components/baseComponents/timeDropdowns/TimeDropdowns';
import { Assignment } from 'model/classroom';
import { changeDeadline } from 'services/axios/assignBrick';
import BaseDialogWrapper from 'components/baseComponents/dialogs/BaseDialogWrapper';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


interface Props {
  isOpen: boolean;
  assignment: Assignment;
  update(deadlineDate: string): void;
  close(): void;
}

const DeadlinePopup:React.FC<Props> = (props) => {
  let initDate = new Date();

  if (props.assignment.deadline) {
    let tempDate = new Date(props.assignment.deadline);
    if (tempDate.getTime() > initDate.getTime()) {
      initDate = tempDate;
    }
  }
  const [deadlineDate, setDeadline] = React.useState(initDate);

  const update = async () => {
    var dateString = deadlineDate.getFullYear() + '-' + (deadlineDate.getMonth() + 1) + '-' + deadlineDate.getDate() + '';
    const res = await changeDeadline(props.assignment.id, dateString);
    if (res) {
      props.update(dateString);
    }
  }

  const renderDeadline = () => (
    <div>
      <div className="r-popup-title bold">When is this assignment due?</div>
      <div className="r-radio-buttons">
        <TimeDropdowns date={deadlineDate} onChange={setDeadline} />
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="dialog-footer centered-important" style={{ justifyContent: 'center' }}>
      <button
        className="btn btn-md bg-theme-orange yes-button icon-button r-long"
        onClick={update} style={{ width: 'auto' }}
      >
        <div className="centered">
          <span className="label">Update</span>
        </div>
      </button>
    </div>
  );

  return (
    <BaseDialogWrapper open={props.isOpen} close={props.close} className="dialog-box light-blue assign-dialog change-deadline-dialog" submit={() => {}}>
      <div className="close-button svgOnHover" onClick={props.close}>
        <SpriteIcon name="cancel-thick" className="active" />
      </div>
      <div className="dialog-header">
        {renderDeadline()}
        {renderFooter()}
      </div>
    </BaseDialogWrapper>
  );
}

export default DeadlinePopup;
