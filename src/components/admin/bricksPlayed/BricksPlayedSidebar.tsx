import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { Subject } from "model/brick";
import CategorySelect from "../components/CategorySelect";
import SubjectsList from "../components/SubjectsList";

export enum PDateFilter {
  Past24Hours,
  PastWeek,
  PastMonth,
  PastYear,
  AllTime
}

export enum ESubjectCategory {
  Everything,
  Arts,
  General,
  Humanities,
  Languages,
  Math,
  Science,
}

interface FilterSidebarProps {
  isLoaded: boolean;
  dateFilter: PDateFilter;
  setDateFilter(filter: PDateFilter): void;
  subjects: Subject[];
  selectedSubjects: Subject[];
  selectSubjects(selectedSubjects: Subject[]): void;
  subjectCategory: ESubjectCategory;
  setSubjectCategory(category: ESubjectCategory): void;
}

interface FilterSidebarState {
  subjectIds: number[];
}

export enum SortClassroom {
  Name,
  Date,
  Assignment
}

class BricksPlayedSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      subjectIds: []
    };
  }

  componentDidUpdate(prevProps: Readonly<FilterSidebarProps>, prevState: Readonly<FilterSidebarState>, snapshot?: any): void {
    if (prevProps.selectedSubjects !== this.props.selectedSubjects) {
      if (this.props.selectedSubjects.length != this.state.subjectIds.length) {
        this.setState({ subjectIds: this.props.selectedSubjects.map(s => s.id) });
      } else {
        // if same number but different subjects rare case
        // no solution yet
      }
    }
  }

  render() {
    const { dateFilter, subjectCategory, setSubjectCategory } = this.props;
    return (
      <Grid
        container item xs={3}
        className="sort-and-filter-container teach-assigned"
      >
        <div className="sort-box">
          <div className="bold font1-5">Admin Data Dashboard</div>
        </div>
        <div className="filter-header">Date</div>
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
        <CategorySelect subjectCategory={subjectCategory} selectCategory={setSubjectCategory} />
        <div className="filter-header">Subjects</div>
        <SubjectsList
          subjects={this.props.subjects}
          filterHeight={"auto"}
          filterBySubject={() => {
          }}
          showUserCount={true}
        />
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default BricksPlayedSidebar;
