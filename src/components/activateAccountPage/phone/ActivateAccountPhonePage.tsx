import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { History } from "history";

import PolicyDialog from 'components/baseComponents/policyDialog/PolicyDialog';
import map from "components/map";
import { Redirect } from "react-router-dom";
import MobileEmailActivate from "./MobileEmailActivate";

export enum LoginState {
  ChooseLoginAnimation,
  ChooseLogin,
  ButtonsAnimation,
  Login
}

interface ActivateAccountProps {
  history: History;
  match: any;
  token: string | null;
  email: string;
}

const ActivateAccountPage: React.FC<ActivateAccountProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }

  const [isPolicyOpen, setPolicyDialog] = useState(initPolicyOpen);

  return (
    <Grid
      className="auth-page login-page"
      container
      item
      justify="center"
      alignItems="center"
    >
      {props.token ? <>
        <MobileEmailActivate
          token={props.token}
          history={props.history}
          email={props.email}
          setPolicyDialog={setPolicyDialog}
        />
        <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
      </>
      : <Redirect to={map.Login} />}
    </Grid>
  );
};

export default ActivateAccountPage;
