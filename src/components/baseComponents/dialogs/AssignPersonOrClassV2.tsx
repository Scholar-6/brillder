import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';

import './AssignPersonOrClass.scss';
import { ReduxCombinedState } from 'redux/reducers';
import SpriteIcon from '../SpriteIcon';
import CreateClassDialog from 'components/teach/assignments/components/CreateClassDialog';
import { Brick } from 'model/brick';
import { User } from 'model/user';

interface AssignClassProps {
  isOpen: boolean;
  user: User;
  history: any;
  subjects: any[];
  brick: Brick;
  submit: any;
  close(): void;
}

const AssignDialog: React.FC<AssignClassProps> = (props) => {
  const [createOpen, setCreateClass] = React.useState(false);

  if (createOpen) {
    return (
      <CreateClassDialog
        isOpen={true}
        history={props.history}
        subjects={[]}
        submit={props.submit}
        close={() => setCreateClass(false)}
      />
    );
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box assign-choice-popup"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title-r1 font-18">How would you like to assign this brick?</div>
          <SpriteIcon name="cancel-custom" onClick={props.close} />
        </div>
      </div>
      <div className="icon-text-btn font-16" onClick={() => {}}>
        <div className="flex-center">
          <SpriteIcon name="send-plane" />
        </div>
        <div className="text-container">
          <div className="bold">Quick Assignment</div>
          <div className="">Create a class with a single click and share instantly</div>
        </div>
        <div className="flex-center">
          <SpriteIcon name="arrow-right" className="arrow-right" />
        </div>
      </div>
      <div className="icon-text-btn font-16" onClick={() => setCreateClass(true)}>
        <div className="flex-center">
          <SpriteIcon name="bricks-icon" />
        </div>
        <div className="text-container">
          <div className="bold">Create Class</div>
          <div className="">Create a new class with this brick and see additional options</div>
        </div>
        <div className="flex-center">
          <SpriteIcon name="arrow-right" className="arrow-right" />
        </div>
      </div>
      <div className="icon-text-btn font-16" onClick={() => { }}>
        <div className="flex-center">
          <SpriteIcon name="manage-class-icon" />
        </div>
        <div className="text-container">
          <div className="bold">Add to Class</div>
          <div className="">Add this brick to one of your current classes</div>
        </div>
        <div className="flex-center">
          <SpriteIcon name="arrow-right" className="arrow-right" />
        </div>
      </div>
      <div className="dialog-footer">
        <div className="flex-center">
          <SpriteIcon name="info-icon" />
        </div>
        <div className="message-box-r5 font-11">
          You can edit class details later from the Manage Classes menu.
        </div>
      </div>
    </Dialog>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(AssignDialog);
