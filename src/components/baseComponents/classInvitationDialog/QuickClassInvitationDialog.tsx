import React, { useEffect } from 'react';
import { Dialog, Grid } from '@material-ui/core';

import './ClassInvitationDialog.scss';
import SpriteIcon from '../SpriteIcon';
import { ClearQuickAssignment, GetQuickAssignment, SetQuickAssignment } from 'localStorage/play';
import { User } from 'model/user';
import { quickAcceptClassroom } from 'services/axios/classroom';


interface Props {
  brickId: number;
  user: User;
  onFinish?(): void;
}

export interface QuickAssigment {
  accepted: boolean;
  typedName: string;
  brick: any;
  classroom: any;
}

const QuickClassInvitationDialog: React.FC<Props> = props => {
  const [name, setName] = React.useState('');
  const [assignment, setAssignment] = React.useState(null as null | QuickAssigment);

  const getInvitations = async () => {
    try {
      const assignment = GetQuickAssignment();
      if (assignment && assignment.accepted !== true) {
        // same brick
        if (assignment.brick.id === props.brickId) {
          setAssignment(assignment)
        }
      }
    } catch (e) { }
  }

  useEffect(() => {
    getInvitations();
  }, []);

  const handleAccept = async () => {
    if (assignment) {
      if (props.user) {
        await quickAcceptClassroom(assignment.classroom.id);
        // need to think what do if failed
        ClearQuickAssignment();
      } else {
        assignment.accepted = true;
        assignment.typedName = name;
        SetQuickAssignment(JSON.stringify(assignment));
      }
      setAssignment(null);
      
    }
  }

  if (assignment) {
    const {classroom} = assignment;
    return (
      <Dialog open={assignment != null} className="dialog-box link-copied-dialog quick-assign-accept-dialog">
        <Grid className="classroom-invitation" container direction="column" alignItems="center">
          <h1 className="bold">Welcome to <span className="capitalize" dangerouslySetInnerHTML={{__html: classroom.name.toUpperCase()}} /></h1>
          <p>Enter your name to join the class. Please make sure to</p>
          <p>enter a name your teacher can recognise</p>
          <input type="text" onChange={e => setName(e.target.value)} />
          <Grid item container direction="row" justifyContent="center">
            <button className="btn btn-md b-green text-white" onClick={handleAccept}>
              <SpriteIcon name="check-custom" />
              Accept
            </button>
          </Grid>
        </Grid>
      </Dialog>
    );
  }
  return <div />;
};

export default QuickClassInvitationDialog;
