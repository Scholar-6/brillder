import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TimeDropdowns from 'components/baseComponents/timeDropdowns/TimeDropdowns';
import { Assignment } from 'model/classroom';
import { changeDeadline } from 'services/axios/assignBrick';


interface Props {
  isOpen: boolean;
  assignment: Assignment;
  update(deadlineDate: string): void;
  close(): void;
}

const DeadlinePopup:React.FC<Props> = (props) => {
  const [deadlineDate, setDeadline] = React.useState(new Date(props.assignment.deadline) || new Date());

  const update = async () => {
    var dateString = deadlineDate.getFullYear() + '-' + deadlineDate.getMonth() + '-' + deadlineDate.getDate() + '';
    const res = await changeDeadline(props.assignment.id, dateString);
    if (res) {
      props.update(dateString);
    }
  }

  const renderDeadline = () => (
    <div>
      <div className="r-popup-title bold">When is it due?</div>
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
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue assign-dialog">
      <div className="dialog-header">
        {renderDeadline()}
        {renderFooter()}
      </div>
    </Dialog>
  );
}

export default DeadlinePopup;
