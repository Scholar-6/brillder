import React, { useEffect } from 'react';
import { Dialog, MobileStepper, Avatar, CardHeader, Grid } from '@material-ui/core';
import { ClassroomInvitation } from 'model/classroom';
import './ClassInvitationDialog.scss';
import axios from "axios";

const ClassInvitationDialog: React.FC = props => {
  const [invitations, setInvitations] = React.useState<ClassroomInvitation[] | undefined>(undefined);
  const [activeStep, setActiveStep] = React.useState(0);

  const getInvitations = async () => {
    try {
      const invitations = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/classrooms/invitations`, {
        withCredentials: true
      });

      setInvitations(invitations.data as ClassroomInvitation[]);
      setActiveStep(0);
    } catch(e) { }
  }

  useEffect(() => {
    if(invitations === undefined) {
      getInvitations();
    }
  }, [invitations, setInvitations, setActiveStep]);

  const handleAccept = async () => {
    if(invitations && invitations[activeStep]) {
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/classrooms/${invitations[activeStep].classroom.id}/accept`, {}, { withCredentials: true });
      setActiveStep(activeStep => activeStep + 1);
      if(activeStep + 1 >= invitations.length) {
        getInvitations();
      }
    }
  }

  const handleReject = async () => {
    if(invitations && invitations[activeStep]) {
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/classrooms/${invitations[activeStep].classroom.id}/reject`, {}, { withCredentials: true });
      setActiveStep(activeStep => activeStep + 1);
      if(activeStep + 1 >= invitations.length) {
        getInvitations();
      }
    }
  }

  const currentInvitation = invitations?.[activeStep];
  return (
    <Dialog
      open={invitations !== undefined && invitations.length > 0}
      className="dialog-box link-copied-dialog"
    >
      {currentInvitation && <Grid className="classroom-invitation" container direction="column" alignItems="center">
        <h1><strong>You have been invited to a class.</strong></h1>
        <div className="classroom-name">
          <h2>{currentInvitation.classroom.name}</h2>
        </div>
        <Grid item container direction="row" justify="center">
          <button className="btn btn-md b-green text-white" onClick={handleAccept}>Accept</button>
          <button className="btn btn-md b-red text-white" onClick={handleReject}>Reject</button>
        </Grid>
        <CardHeader
          className="sent-by"
          avatar={<Avatar src={`${process.env.REACT_APP_BACKEND_HOST}/files/${currentInvitation.sentBy.profileImage}`} />}
          title={`sent by ${currentInvitation.sentBy.firstName} ${currentInvitation.sentBy.lastName}`}
        />
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

export default ClassInvitationDialog;