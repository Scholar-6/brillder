
import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { User } from "model/user";

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

  isAllSubjects: boolean;
  setAllSubjects(value: boolean): void;

  isViewAll: boolean;
  selectAllSubjects(isViewAll: boolean): void;

  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  clearSubjects(): void;
  filterBySubject(id: number): void;
}

interface FilterState {
  filterExpanded: boolean;
  filterHeight: any;
}

class ViewAllFilterComponent extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {
      filterHeight: "auto",
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

  renderSubjectLabelBox() {
    return (
      <div className="filter-header">
        <span>Subjects</span>
      </div>
    );
  }

  renderSubjectsToggle() {
    if (!this.props.user) {
      return "";
    }
    return (
      <div className="subjects-toggle">
        <div
          className={`${!this.props.isAllSubjects ? 'toggle-button my-subjects active' : 'toggle-button my-subjects not-active'}`}
          onClick={() => {
            if (this.props.isAllSubjects) {
              this.props.setAllSubjects(false);
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
          className={`${this.props.isAllSubjects ? 'toggle-button all-subjects active' : 'toggle-button all-subjects not-active'}`}
          onClick={() => {
            if (!this.props.isAllSubjects) {
              this.props.setAllSubjects(true);
            }
          }}
        >
          All Subjects
        </div>
      </div>
    );
  }

  render() {
    let { subjects } = this.props;
    if (!this.props.isAllSubjects) {
      subjects = [];
      for (let subject of this.props.userSubjects) {
        for (let s of this.props.subjects) {
          if (s.id === subject.id) {
            subjects.push(s);
          }
        }
      }
      subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
    }
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        <div className="sort-box">
          <div className="filter-container sort-by-box view-all-sort-box" style={{ height: '6.5vw' }}>
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
          {this.renderSubjectLabelBox()}
          {this.renderSubjectsToggle()}
          <SubjectsListV3
            isPublic={this.props.isCore}
            subjects={subjects}
            isAll={this.props.isViewAll}
            isSelected={this.props.isClearFilter}
            toggleAll={() => this.props.selectAllSubjects(!this.props.isViewAll)}
            filterHeight={this.state.filterHeight}
            filterBySubject={this.props.filterBySubject}
          />
          <div className="sidebar-footer" />
        </div>
      </Grid>
    );
  }
}

export default ViewAllFilterComponent;
