import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';

import './CreateClassDialog.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';

interface AssignClassProps {
  isOpen: boolean;
  submit(value: string): void;
  close(): void;

  user: User;
}

const CreateClassDialog: React.FC<AssignClassProps> = (props) => {
  const [value, setValue] = React.useState("");

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog"
    >
      <div className="close-button svgOnHover" onClick={props.close}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="dialog-header" style={{ marginBottom: '2vh' }}>
        <div className="title">Name Your Class</div>
        <div className="regular">Enter a name that will help you identify the class, e.g. Year 12 French, Set A 2022</div>
        <input placeholder="Class Name" value={value} onChange={e => setValue(e.target.value)} />
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={() => {
            if (value) {
              props.submit(value);
            }
          }}>
          <span className="bold">Create</span>
        </button>
      </div>
    </Dialog>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(CreateClassDialog);