import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { UserPreferenceType } from "model/user";
import SubjectsSelect from "../components/SubjectsSelect";
import { Subject } from "model/brick";
import { PDateFilter } from "../bricksPlayed/BricksPlayedSidebar";
import { CDomain } from "../classesEvents/ClassesSidebar";

interface FilterSidebarProps {
  isLoaded: boolean;
  subjects: Subject[];

  selectedSubjects: Subject[];
  selectSubjects(s: Subject[]): void;

  userPreference: UserPreferenceType | null;
  setUserPreference(userPreference: UserPreferenceType | null): void;

  dateFilter: PDateFilter;
  setDateFilter(dateFilter: PDateFilter): void;

  domains: CDomain[];
  setDomain(d: CDomain): void;
  allDomains: boolean;
  setAllDomains(): void;
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
    const { userPreference, dateFilter } = this.props;
    return (
      <Grid container item xs={3} className="sort-and-filter-container teach-assigned">
        <div className="sort-box">
          <div className="bold font1-5">Admin Data Dashboard</div>
        </div>
        <div className="filter-header">Date Filter</div>
        <div className="sort-radio-btns filter-row margin-smaller top-margin-bigger">
          <FormControlLabel
            checked={dateFilter === PDateFilter.Past24Hours}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.Past24Hours)} className={"filter-radio custom-color"} />}
            label="Past 24 hours" />
          <FormControlLabel
            checked={dateFilter === PDateFilter.PastWeek}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.PastWeek)} className={"filter-radio custom-color"} />}
            label="Past week" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={dateFilter === PDateFilter.PastMonth}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.PastMonth)} className={"filter-radio custom-color"} />}
            label="Past month" />
          <FormControlLabel
            checked={dateFilter === PDateFilter.PastYear}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.PastYear)} className={"filter-radio custom-color"} />}
            label="Past year" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={dateFilter === PDateFilter.AllTime}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.AllTime)} className={"filter-radio custom-color"} />}
            label="All time" />
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
        <div className="filter-header">School Domain</div>
        <div className="filter-domain">
          <div className="sort-radio-btns filter-row margin-smaller">
            <FormControlLabel
              checked={this.props.allDomains === true}
              control={<Radio onClick={() => this.props.setAllDomains()} className={"filter-radio custom-color"} />}
              label="All" />
          </div>
          {this.props.domains.map((d, k) =>
            <div className="sort-radio-btns filter-row margin-smaller" key={k}>
              <FormControlLabel
                checked={d.checked === true}
                control={<Radio onClick={() => this.props.setDomain(d)} className={"filter-radio custom-color"} />}
                label={d.name} />
            </div>
          )}
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