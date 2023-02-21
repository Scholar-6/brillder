import React from "react";
import Dialog from "@material-ui/core/Dialog";

import './PremiumEducatorDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import routes from "components/play/routes";

interface InvitationProps {
  assignment: any;
  history: any;
  close(): void;
}

const AdaptedBrickAssignedDialog: React.FC<InvitationProps> = props => {
  console.log(props.assignment)
  return (
    <Dialog
      open={!!props.assignment}
      onClose={props.close}
      className="dialog-box premium-educator-dialog bold"
    >
      <div className="close-button svgOnHover" onClick={props.close}>
        <SpriteIcon name="cancel-thick" className="active" />
      </div>
      <div className="flex-center premium-label">
        You’ve been assigned a personal version of this brick
      </div>
      <div className="flex-center">
        <div className="green-btn" onClick={() => props.history.push(routes.playCover(props.assignment.brick))}>
          Go to assignment
        </div>
      </div>
    </Dialog>
  );
};

export default AdaptedBrickAssignedDialog;
