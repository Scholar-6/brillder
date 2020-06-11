import './AddUserButton.scss';
import React from 'react';
import { Grid } from '@material-ui/core';

interface AddUserButtonProps {
  history: any;
}

const AddUserButton: React.FC<AddUserButtonProps> = ({history}) => {
  const moveToNewUser = () => {
    //history.push('/build/new-profile');
  }

  return (
    <div className="add-user-button" onClick={moveToNewUser} >
      <Grid container justify="center">
        <img alt="" className="add-user-image" src="/feathericons/svg/user-plus-blue.svg" />
      </Grid>
      <Grid container justify="center">
        ADD USER
      </Grid>
    </div>
  );
}

export default AddUserButton;
