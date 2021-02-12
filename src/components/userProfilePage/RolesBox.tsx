import { RolePreference, UserPreference } from "model/user";
import React, { Component } from "react";
import { Grid, Radio, FormControlLabel } from "@material-ui/core";

import { setUserPreference } from 'services/axios/user';

import { UserRoleItem } from "./model";

interface BoxState {
  rolePreference?: RolePreference;
}

interface BoxProps {
  roles: any[];
  userRoles: any[];
  rolePreference?: any;
  toggleRole(roleId: number, disabled: boolean): void;
}

class RolesBox extends Component<BoxProps, BoxState> {
  constructor(props: BoxProps) {
    super(props);

    this.state = {
      rolePreference: props.rolePreference,
    };
  }

  async onPreferenceChange(rolePreference: RolePreference) {
    const success = await setUserPreference(rolePreference as any);
    if (success) {
      this.setState({ rolePreference });
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
    const { rolePreference } = this.state;
    return (
      <Grid container className="roles-box">
        <Grid item>
          <FormControlLabel
            className="filter-container"
            checked={rolePreference === RolePreference.Student}
            onClick={() => this.onPreferenceChange(RolePreference.Student)}
            control={<Radio className="filter-radio" />}
            label="Student"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            className="filter-container"
            checked={rolePreference === RolePreference.Teacher}
            onClick={() => this.onPreferenceChange(RolePreference.Teacher)}
            control={<Radio className="filter-radio" />}
            label="Teacher"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            className="filter-container"
            checked={rolePreference === RolePreference.Builder}
            onClick={() => this.onPreferenceChange(RolePreference.Builder)}
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
