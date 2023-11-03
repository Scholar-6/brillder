import React, { useEffect } from 'react';
import { Dialog, Grid } from '@material-ui/core';

import './ClassInvitationDialog.scss';
import SpriteIcon from '../SpriteIcon';
import { ClearQuickAssignment, GetQuickAssignment, SetQuickAssignment } from 'localStorage/play';
import { User } from 'model/user';
import { quickAcceptClassroom } from 'services/axios/classroom';
import map from 'components/map';


interface Props {
  brickId: number;
  user: User;
  history: any;
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
    const { classroom } = assignment;
    if (!props.user) {
      return (
        <Dialog open={assignment != null} className="dialog-box link-copied-dialog quick-assign-accept-dialog">
          <Grid className="classroom-invitation" container direction="column" alignItems="center">
            <h1 className="bold">Welcome to <span className="capitalize" dangerouslySetInnerHTML={{ __html: classroom.name.toUpperCase() }} /></h1>
            <h2>Created by {classroom.teacher.firstName}</h2>
            <p>Sign in if you already have an account. Continue as a guest</p>
            <input type="text" placeholder="Enter your name" onChange={e => setName(e.target.value)} />
            <Grid item container direction="row" justifyContent="center">
              <button className="btn btn-md b-green text-white" onClick={() => props.history.push(map.Login)}>
                <div className="signin-button flex-center">
                  <div className="flex-center">
                    <SpriteIcon name="arrow-left" />
                  </div>
                  Sign In
                </div>
              </button>
              <button className="btn btn-md b-green text-white" onClick={handleAccept}>
                <SpriteIcon name="check-custom" />
                Continue
              </button>
            </Grid>
          </Grid>
        </Dialog>
      );
    }
  }
  return <div />;
};

export default QuickClassInvitationDialog;
