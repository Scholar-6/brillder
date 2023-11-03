import React, { useEffect } from 'react';
import { Dialog, Grid } from '@material-ui/core';

import './ClassInvitationDialog.scss';
import { ClearQuickAssignment, GetQuickAssignment, SetQuickAssignment } from 'localStorage/play';
import { User } from 'model/user';
import { quickAcceptClassroom } from 'services/axios/classroom';
import HoverHelp from '../hoverHelp/HoverHelp';
import AssignLoginDialog from './AssignLoginDialog';


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
  const [signIn, setSign] = React.useState(false);
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
      if (signIn) {
        return <AssignLoginDialog close={() => setSign(false)} history={props.history} />
      }
      return (
        <Dialog open={assignment != null} className="dialog-box link-copied-dialog quick-assign-accept-dialog">
          <Grid className="classroom-invitation" container direction="column" alignItems="center">
            <h1 className="bold">Welcome to <span className="capitalize" dangerouslySetInnerHTML={{ __html: classroom.name.toUpperCase() }} /></h1>
            <h2>Created by {classroom.teacher.firstName}</h2>
            <div className="text-with-help">
              Enter your name to start playing now
              <HoverHelp icon="help-circle-white">
                Your teacher will see your score and the name you have entered.
              </HoverHelp>
            </div>
            <input type="text" placeholder="Enter your name" onChange={e => setName(e.target.value)} />
            <button className="btn btn-md b-green text-white" onClick={handleAccept}>
              Join Class
            </button>
            <div className="flex-center login-or-content">
              <div className="line"></div><div>OR</div><div className="line"></div>
            </div>
            <div className="text-with-help">
              Sign in to your Brillder account first
              <HoverHelp icon="help-circle-white">
                Sign in before playing to keep track of your score and add it to your personal library. You can also connect your account after playing.
              </HoverHelp>
            </div>
            <button className="btn btn-md b-green text-white" onClick={() => setSign(true) /*props.history.push(map.Login)*/}>
              Sign In
            </button>
            <div className="bottom-text italic">
              Don’t have a Brillder account? Enter your name to play as a<br /> guest, and you can sign up afterwards.
            </div>
          </Grid>
        </Dialog>
      );
    }
  }
  return <div />;
};

export default QuickClassInvitationDialog;
