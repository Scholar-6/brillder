import React, { useEffect } from 'react';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { Dialog, MobileStepper, Avatar, CardHeader, Grid } from '@material-ui/core';
import { BrickInvitation } from 'model/classroom';

import './ClassInvitationDialog.scss';
import map from 'components/map';
import SpriteIcon from '../SpriteIcon';
import { stripHtml } from 'components/build/questionService/ConvertService';

interface Props {
  onFinish?(): void;
}

const PersonalBrickInvitationDialog: React.FC<Props> = props => {
  /*
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
        const classId = invitations[activeStep].brick.id;
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/classrooms/${invitations[activeStep].brick.id}/accept`, {}, { withCredentials: true });
        if (res.data && res.data === 'OK') {
          setActiveStep(activeStep => activeStep + 1);
          if (activeStep + 1 >= invitations.length) {
            const newInvitations = await getInvitations();
            if (newInvitations && newInvitations.length <= 0) {
              history.push(map.AssignmentsPage + '/' + classId);
              props.onFinish?.();
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
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/classrooms/${invitations[activeStep].brick.id}/reject`, {}, { withCredentials: true });
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
        <h1><strong>You have been invited to a brick.</strong></h1>
        <div className="classroom-name">
          <h2>{stripHtml(currentInvitation.brick.title)}</h2>
        </div>
        <Grid item container direction="row" justify="center">
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
  */

  return <div />;
};

export default PersonalBrickInvitationDialog;