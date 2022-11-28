import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { UserPreferenceType } from "model/user";
import SubjectsSelect from "../components/SubjectsSelect";
import { Subject } from "model/brick";

interface FilterSidebarProps {
  isLoaded: boolean;
  userPreference: UserPreferenceType | null;
  subjects: Subject[];
  selectedSubjects: Subject[];
  selectSubjects(s: Subject[]): void;
  setUserPreference(userPreference: UserPreferenceType | null): void;
}

export enum SortClassroom {
  Name,
  Date,
  Assignment
}

interface FilterSidebarState {
  subjectIds: number[];
}

class UsersSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      subjectIds: []
    };
  }
  
  render() {
    const { userPreference } = this.props;
    return (
      <Grid container item xs={3} className="sort-and-filter-container teach-assigned">
        <div className="sort-box">
          <div className="bold font1-5">Admin Data Dashboard</div>
        </div>
        <div className="filter-header">User Type</div>
        <div className="sort-radio-btns filter-row margin-smaller top-margin-bigger">
          <FormControlLabel
            checked={userPreference === null}
            control={<Radio onClick={() => this.props.setUserPreference(null)} className={"filter-radio custom-color"} />}
            label="All" />
          <FormControlLabel
            checked={userPreference === UserPreferenceType.Student}
            control={<Radio onClick={() => this.props.setUserPreference(UserPreferenceType.Student)} className={"filter-radio custom-color"} />}
            label="Learner" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={userPreference === UserPreferenceType.Teacher}
            control={<Radio onClick={() => this.props.setUserPreference(UserPreferenceType.Teacher)} className={"filter-radio custom-color"} />}
            label="Educator" />
          <FormControlLabel
            checked={userPreference === UserPreferenceType.Institution}
            control={<Radio onClick={() => this.props.setUserPreference(UserPreferenceType.Institution)} className={"filter-radio custom-color"} />}
            label="Institution" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={userPreference === UserPreferenceType.Builder}
            control={<Radio onClick={() => this.props.setUserPreference(UserPreferenceType.Builder)} className={"filter-radio custom-color"} />}
            label="Builder" />
        </div>
        <SubjectsSelect
          subjectIds={this.state.subjectIds}
          subjects={this.props.subjects}
          selectedSubjects={this.props.selectedSubjects}
          selectSubjects={(subjectIds, subjects) => {
            this.setState({ subjectIds });
            this.props.selectSubjects(subjects);
          }}
        />
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default UsersSidebar;