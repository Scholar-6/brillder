import React from 'react';
import { Grid } from "@material-ui/core";

import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import UserProfilePreview from "../components/UserProfilePreview";

interface Props {
  user: any;
  previewAnimationFinished(): void;
}

const ProfilePhonePreview: React.FC<Props> = props => {
  return (
    <div className="profile-phone-preview">
      <Grid
        container
        justify="center"
        alignContent="center"
        style={{ height: "100%" }}
      >
        <PhonePreview Component={UserProfilePreview} data={{ user: props.user }} action={props.previewAnimationFinished} />
      </Grid>
    </div>
  );
}

export default ProfilePhonePreview;
