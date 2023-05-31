import React, { useEffect } from 'react';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { Dialog, MobileStepper, Grid } from '@material-ui/core';
import { BrickInvitation } from 'model/classroom';

import './ClassInvitationDialog.scss';
import map from 'components/map';

interface Props {
  onFinish?(): void;
}

const PersonalBrickInvitationDialog: React.FC<Props> = props => {
  const [invitations, setInvitations] = React.useState<BrickInvitation[] | undefined>(undefined);
  const [activeStep, setActiveStep] = React.useState(0);

  const history = useHistory();

  const getInvitations = async () => {
    try {
      const invitations = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/brick/personal/invitations`, {
        withCredentials: true
      });

      setInvitations(invitations.data as BrickInvitation[]);
      setActiveStep(0);

      return invitations.data as BrickInvitation[];
    } catch (e) { }
  }

  useEffect(() => {
    if (invitations === undefined) {
      getInvitations();
    }
  }, [invitations, setInvitations, setActiveStep]);

  const handleAccept = async () => {
    try {
      if (invitations && invitations[activeStep]) {
        const brickId = invitations[activeStep].brick.id;
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/brick/${brickId}/accept`, {}, { withCredentials: true });
        if (res.data && res.data === 'OK') {
          setActiveStep(activeStep => activeStep + 1);
          if (activeStep + 1 >= invitations.length) {
            const newInvitations = await getInvitations();
            if (newInvitations && newInvitations.length <= 0) {
              //history.push(map.AssignmentsPage + '/' + classId);
              //props.onFinish?.();
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleReject = async () => {
    if (invitations && invitations[activeStep]) {
      const brickId = invitations[activeStep].brick.id;
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/brick/${brickId}/reject`, {}, { withCredentials: true });
      setActiveStep(activeStep => activeStep + 1);
      if (activeStep + 1 >= invitations.length) {
        getInvitations();
      }
    }
  }

  const currentInvitation = invitations?.[activeStep];

  return (
    <Dialog
      open={invitations !== undefined && invitations.length > 0}
      className="dialog-box link-copied-dialog personal-brick-invitation"
    >
      {currentInvitation && <Grid className="classroom-invitation" container direction="column" alignItems="center">
        <h1 className="brick-title-re2"><strong>“<span dangerouslySetInnerHTML={{ __html: currentInvitation.brick.title}} />”</strong></h1>
        <div className="text-center">
          {currentInvitation.sentBy.firstName} {currentInvitation.sentBy.lastName} would like to share their personal bricks with you.<br/>
          Accepting will add their brick to your personal catalogue.
        </div>
        <Grid item container direction="row" justifyContent="center">
          <button className="btn btn-md b-red text-white" onClick={handleReject}>
            Reject
          </button>
          <button className="btn btn-md b-green text-white" onClick={handleAccept}>
            Accept
          </button>
        </Grid>
        <MobileStepper 
          variant="dots"
          steps={invitations!.length}
          activeStep={activeStep}
          position="static"
          nextButton={<div />}
          backButton={<div />}
        />
      </Grid>}
    </Dialog>
  );
};

export default PersonalBrickInvitationDialog;