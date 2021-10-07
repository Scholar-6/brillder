import React from "react";
import Dialog from "@material-ui/core/Dialog";
import TimeDropdowns from "../timeDropdowns/TimeDropdowns";
import './CompetitionDialog.scss';

interface DialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const CompetitionDialog: React.FC<DialogProps> = ({ isOpen, submit, close }) => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box competition-dialog">
      <div className="dialog-header">
        Create competition
        <div>
          <TimeDropdowns date={startDate} onChange={setStartDate} />
        </div>
        <div>
          <TimeDropdowns date={endDate} onChange={setEndDate} />
        </div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={close}>
          <span>No</span>
        </button>
      </div>
    </Dialog>
  );
};

export default CompetitionDialog;
