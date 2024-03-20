import React from "react";
import { Dialog } from '@material-ui/core';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface TasterProps {
  isOpen: boolean;
  moveToBrick(): void;
  close(): void;
}

const TasterBrickDialog: React.FC<TasterProps> = (props) => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box taster-brick-popup"
    >
      <div className="flex-center">
        <SpriteIcon name="taster-brick-popup-icon" className="active" />
      </div>
      <div className="font-36 text-center bold title-e234">Taster topic</div>
      <div className="font-25 text-center">
        You're going to a taster brick. Once<br />
        you’re finished, you'll come right back here.
      </div>
      <div className="dialog-footer font-25">
        <button className="btn btn-md bg-custom-blue no-button"
          onClick={props.close}>
          <span>Nevermind</span>
        </button>
        <button className="btn btn-md bg-theme-green yes-button"
          onClick={props.moveToBrick}>
          <span>Let’s do it!</span>
        </button>
      </div>
    </Dialog>
  )
}

export default TasterBrickDialog;
