import React from "react";
import Dialog from "@material-ui/core/Dialog";
import TimeDropdowns from "../timeDropdowns/TimeDropdowns";
import './CompetitionDialog.scss';
import SpriteIcon from "../SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  submit(start: any, end: any): void;
  close(): void;
}

const CompetitionDialog: React.FC<DialogProps> = ({ isOpen, submit, close }) => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  /*
  const getStringDate = (date: Date) => {
    return date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
  }*/

  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box competition-dialog">
      <div className="close-button svgOnHover" onClick={close}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="dialog-header">
        <div className="title-sr4">
          How long will this competition run for?
        </div>
        <div className="flex-center">
          <div>
            Start
          </div>
          <TimeDropdowns date={startDate} onChange={setStartDate} />
        </div>
        <div className="flex-center">
          <div>
            End
          </div>
          <TimeDropdowns date={endDate} onChange={setEndDate} />
        </div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-green yes-button" onClick={() => submit(startDate, endDate)}>
          <span>Launch</span>
        </button>
      </div>
    </Dialog>
  );
};

export default CompetitionDialog;
