import { UserPreferenceEnum } from "model/user";
import React, { Component } from "react";
import { Grid, Radio, FormControlLabel } from "@material-ui/core";

import { setUserPreference } from 'services/axios/user';

import { UserRoleItem } from "./model";

interface BoxState {
  preferenceId?: UserPreferenceEnum;
}

interface BoxProps {
  roles: any[];
  userRoles: any[];
  preferenceId: UserPreferenceEnum;
  toggleRole(roleId: number, disabled: boolean): void;
}

class RolesBox extends Component<BoxProps, BoxState> {
  constructor(props: BoxProps) {
    super(props);

    this.state = {
      preferenceId: props.preferenceId,
    };
  }

  async onPreferenceChange(preferenceId: UserPreferenceEnum) {
    const success = await setUserPreference(preferenceId);
    if (success) {
      this.setState({ preferenceId });
    }
  }

  checkUserRole(roleId: number) {
    return this.props.userRoles.some((id) => id === roleId);
  }

  renderRole(role: UserRoleItem) {
    let checked = this.checkUserRole(role.roleId);

    return (
      <FormControlLabel
        className={`filter-container ${role.disabled ? "disabled" : ""}`}
        checked={checked}
        onClick={() => this.props.toggleRole(role.roleId, role.disabled)}
        control={<Radio className="filter-radio" />}
        label={role.name}
      />
    );
  }

  render() {
    const { preferenceId } = this.state;
    return (
      <Grid container className="roles-box">
        <Grid item>
          <FormControlLabel
            className="filter-container"
            checked={preferenceId === UserPreferenceEnum.Student}
            onClick={() => this.onPreferenceChange(UserPreferenceEnum.Student)}
            control={<Radio className="filter-radio" />}
            label="Student"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            className="filter-container"
            checked={preferenceId === UserPreferenceEnum.Teacher}
            onClick={() => this.onPreferenceChange(UserPreferenceEnum.Teacher)}
            control={<Radio className="filter-radio" />}
            label="Teacher"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            className="filter-container"
            checked={preferenceId === UserPreferenceEnum.Builder}
            onClick={() => this.onPreferenceChange(UserPreferenceEnum.Builder)}
            control={<Radio className="filter-radio" />}
            label="Builder"
          />
        </Grid>

        {/* Publisher, Institution and Admin roles */}
        <Grid item>{this.renderRole(this.props.roles[0])}</Grid>
        <Grid item>{this.renderRole(this.props.roles[1])}</Grid>
        <Grid item>{this.renderRole(this.props.roles[2])}</Grid>
      </Grid>
    );
  }
}

export default RolesBox;
