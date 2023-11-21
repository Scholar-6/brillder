import React, { useEffect } from 'react';
import { Dialog, MobileStepper, Avatar, CardHeader, Grid } from '@material-ui/core';
import { ClassroomInvitation } from 'model/classroom';
import './ClassInvitationDialog.scss';
import axios from "axios";
import map from 'components/map';
import { useHistory } from 'react-router-dom';
import SpriteIcon from '../SpriteIcon';

interface Props {
  onFinish?(classId: number): void;
}

const ClassInvitationDialog: React.FC<Props> = props => {
  const [invitations, setInvitations] = React.useState<ClassroomInvitation[] | undefined>(undefined);
  const [activeStep, setActiveStep] = React.useState(0);

  const history = useHistory();

  const getInvitations = async () => {
    try {
      const invitations = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/classrooms/invitations`, {
        withCredentials: true
      });

      setInvitations(invitations.data as ClassroomInvitation[]);
      setActiveStep(0);

      return invitations.data as ClassroomInvitation[];
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
        const classId = invitations[activeStep].classroom.id;
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_HOST}/classrooms/${invitations[activeStep].classroom.id}/accept`,
          {}, { withCredentials: true }
        );
        if (res.data && res.data === 'OK') {
          setActiveStep(activeStep => activeStep + 1);
          if (activeStep + 1 >= invitations.length) {
            const newInvitations = await getInvitations();
            if (newInvitations && newInvitations.length <= 0) {
              history.push(map.AssignmentsPage + '/' + classId);
              props.onFinish?.(classId);
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
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/classrooms/${invitations[activeStep].classroom.id}/reject`, {}, { withCredentials: true });
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
      className="dialog-box link-copied-dialog"
    >
      {currentInvitation && <Grid className="classroom-invitation" container direction="column" alignItems="center">
        <h1><strong>You have been invited to a class</strong></h1>
        <div className="classroom-name">
          <h2>{currentInvitation.classroom.name}</h2>
        </div>
        <Grid item container direction="row" justifyContent="center">
          <button className="btn btn-md b-green text-white" onClick={handleAccept}>
            <SpriteIcon name="check-custom" />
            Accept
          </button>
          <button className="btn btn-md b-red text-white" onClick={handleReject}>
            <SpriteIcon name="cancel-custom" />
            Reject
          </button>
        </Grid>
        <CardHeader
          className="sent-by"
          avatar={<Avatar src={`${process.env.REACT_APP_AWS_S3_IMAGES_BUCKET_NAME}/files/${currentInvitation.sentBy.profileImage}`} />}
          title={`Sent by ${currentInvitation.sentBy.firstName} ${currentInvitation.sentBy.lastName}`}
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