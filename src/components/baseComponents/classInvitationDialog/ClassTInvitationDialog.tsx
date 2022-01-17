import React, { useEffect } from 'react';
import { Dialog, MobileStepper, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { TeachClassroomInvitation } from 'model/classroom';
import './ClassInvitationDialog.scss';
import map from 'components/map';
import { getTeachClassInvitations, teachAcceptClass, teachRejectClass } from 'services/axios/classroom';
import SpriteIcon from '../SpriteIcon';

interface Props {
  onFinish?(): void;
}

const ClassTInvitationDialog: React.FC<Props> = props => {
  const [invitations, setInvitations] = React.useState<TeachClassroomInvitation[] | undefined>(undefined);
  const [activeStep, setActiveStep] = React.useState(0);

  const history = useHistory();

  const getInvitations = async () => {
    try {
      const invitations = await getTeachClassInvitations();

      setInvitations(invitations as TeachClassroomInvitation[]);
      setActiveStep(0);

      return invitations as TeachClassroomInvitation[];
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
        const classId = invitations[activeStep].id;
        const res = await teachAcceptClass(classId);
        if (res) {
          setActiveStep(activeStep => activeStep + 1);
          if (activeStep + 1 >= invitations.length) {
            const newInvitations = await getInvitations();
            if (newInvitations && newInvitations.length <= 0) {
              history.push(map.ManageClassroomsTab + '?classroomId=' + classId);
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
      const classId = invitations[activeStep].id;
      const res = await teachRejectClass(classId);
      if (res) {
        setActiveStep(activeStep => activeStep + 1);
        if (activeStep + 1 >= invitations.length) {
          getInvitations();
        }
      }
    }
  }

  if (!invitations) {
    return <div />
  }

  const currentInvitation = invitations?.[activeStep];
  return (
    <Dialog
      open={invitations !== undefined && invitations.length > 0}
      className="dialog-box link-copied-dialog"
    >
      {currentInvitation && <Grid className="classroom-invitation" container direction="column" alignItems="center">
        <h1 className="bold">A class has been shared with you.</h1>
        <div className="classroom-name">
          <h2>{currentInvitation.name}</h2>
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

export default ClassTInvitationDialog;