import { UserPreferenceType } from "model/user";
import React, { Component } from "react";
import { Grid, Radio, FormControlLabel } from "@material-ui/core";

import { setUserPreference, setUserPreferenceTypeById } from 'services/axios/user';

import { UserRoleItem } from "./model";

interface BoxState {
  userPreference?: UserPreferenceType;
}

interface BoxProps {
  roles: any[];
  userRoles: any[];
  userId: number;
  isAdmin: boolean;
  userPreference?: any;
  togglePreference(): void;
  toggleRole(roleId: number, disabled: boolean): void;
}

class RolesBox extends Component<BoxProps, BoxState> {
  constructor(props: BoxProps) {
    super(props);

    this.state = {
      userPreference: props.userPreference,
    };
  }

  async onPreferenceChange(userPreference: UserPreferenceType) {
    this.props.togglePreference();
    if (this.props.isAdmin && this.props.userId) {
      const success = await setUserPreferenceTypeById(userPreference, this.props.userId);
      if (success) {
        this.setState({ userPreference });
      }
    } else {
      const success = await setUserPreference(userPreference);
      if (success) {
        this.setState({ userPreference });
      }
    }
  }

  checkUserRole(roleId: number) {
    return this.props.userRoles.some((id) => id === roleId);
  }

  renderRole(role: UserRoleItem) {
    const checked = this.checkUserRole(role.roleId);

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
    const { userPreference } = this.state;
    return (
      <div className="flex-center roles-box">
        <p className="fixed-label">User Type</p>
        <div className="first-column">
          <Grid item>
            <FormControlLabel
              className="filter-container"
              checked={userPreference === UserPreferenceType.Student}
              onClick={() => this.onPreferenceChange(UserPreferenceType.Student)}
              control={<Radio className="filter-radio" />}
              label="Learner"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              className="filter-container"
              checked={userPreference === UserPreferenceType.Teacher}
              onClick={() => this.onPreferenceChange(UserPreferenceType.Teacher)}
              control={<Radio className="filter-radio" />}
              label="Educator"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              className="filter-container"
              checked={userPreference === UserPreferenceType.Builder}
              onClick={() => this.onPreferenceChange(UserPreferenceType.Builder)}
              control={<Radio className="filter-radio" />}
              label="Builder"
            />
          </Grid>
        </div>
        <div>
          <Grid item>
            <FormControlLabel
              className="filter-container"
              checked={userPreference === UserPreferenceType.Institution}
              onClick={() => this.onPreferenceChange(UserPreferenceType.Institution)}
              control={<Radio className="filter-radio" />}
              label="Institution"
            />
          </Grid>

          {/* Publisher and Admin roles */}
          <Grid item>{this.renderRole(this.props.roles[0])}</Grid>
          <Grid item>{this.renderRole(this.props.roles[1])}</Grid>
        </div>
      </div>
    );
  }
}

export default RolesBox;
