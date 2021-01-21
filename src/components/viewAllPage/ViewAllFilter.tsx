
import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { User } from "model/user";
import './ViewAllFilter.scss';

import UnauthorizedSidebar from "./components/UnauthrizedSidebar";
import SubjectsListV3 from "components/baseComponents/subjectsList/SubjectsListV3";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export enum SortBy {
  None,
  Date,
  Popularity,
}

interface FilterProps {
  sortBy: SortBy;
  subjects: any[];
  userSubjects: any[];
  isClearFilter: any;
  isCore: boolean;
  user: User;

  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  clearSubjects(): void;
  filterBySubject(id: number): void;
}

interface FilterState {
  filterExpanded: boolean;
  isAllSubjects: boolean;
  filterHeight: any;
}

class ViewAllFilterComponent extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {
      filterHeight: "auto",
      isAllSubjects: true,
      filterExpanded: true,
    }
  }

  hideFilter() {
    this.setState({ ...this.state, filterExpanded: false, filterHeight: "0" });
  }

  expandFilter() {
    this.setState({
      ...this.state,
      filterExpanded: true,
      filterHeight: "auto",
    });
  }

  render() {
    let { subjects } = this.props;
    if (!this.state.isAllSubjects) {
      subjects = this.props.userSubjects;
    }
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        {this.props.user ?
          <div className="sort-box">
            <div className="filter-container sort-by-box view-all-sort-box" style={{height: '6.5vw'}}>
              <div className="sort-header">Sort By</div>
              <RadioGroup
                className="sort-group"
                aria-label="SortBy"
                name="SortBy"
                value={this.props.sortBy}
                onChange={this.props.handleSortChange}
              >
                <Grid container direction="row">
                  <Grid item xs={6}>
                    <FormControlLabel
                      value={SortBy.Popularity}
                      style={{ marginRight: 0, width: "50%" }}
                      control={<Radio className="sortBy" />}
                      label="Popularity"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      value={SortBy.Date}
                      style={{ marginRight: 0 }}
                      control={<Radio className="sortBy" />}
                      label="Date Added"
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </div>
            <div className="filter-header">
              <span>Subjects</span>
              <button
                className={
                  "btn-transparent filter-icon " +
                  (this.state.filterExpanded
                    ? this.props.isClearFilter
                      ? "arrow-cancel"
                      : "arrow-down"
                    : "arrow-up")
                }
                onClick={() => {
                  this.state.filterExpanded
                    ? this.props.isClearFilter
                      ? this.props.clearSubjects()
                      : this.hideFilter()
                    : this.expandFilter();
                }}
              ></button>
            </div>
            <div className="subjects-toggle">
              <div
                className={`${!this.state.isAllSubjects ? 'toggle-button my-subjects active' : 'toggle-button my-subjects not-active'}`}
                onClick={() => {
                  if (this.state.isAllSubjects) {
                    this.props.clearSubjects();
                    this.setState({ isAllSubjects: false });
                  }
                }}
              >
                <div className="icon-container">
                  <SpriteIcon name="user" />
                </div>
                <div className="text-container">
                  My Subjects
                </div>
              </div>
              <div
                className={`${this.state.isAllSubjects ? 'toggle-button all-subjects active' : 'toggle-button all-subjects not-active'}`}
                onClick={() => {
                  if (!this.state.isAllSubjects) {
                    this.props.clearSubjects();
                    this.setState({ isAllSubjects: true });
                  }
                }}
              >
                All Subjects
              </div>
            </div>
            <SubjectsListV3
              isPublic={this.props.isCore}
              subjects={subjects}
              filterHeight={this.state.filterHeight}
              filterBySubject={this.props.filterBySubject}
            />
          </div>
          : <UnauthorizedSidebar />
        }
      </Grid>
    );
  }
}

export default ViewAllFilterComponent;
