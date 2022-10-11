import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";
import { ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';

import { Subject } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export enum PSortBy {
  MostPlayed,
  LeastPlayed
}

export enum PDateFilter {
  Today,
  Past3Days,
  PastWeek,
  PastMonth,
  AllTime
}

export enum ESubjectCategory {
  Everything,
  STEM,
  Humanities,
  General,
  Others
}

interface FilterSidebarProps {
  isLoaded: boolean;
  sortBy: PSortBy;
  setSort(sort: PSortBy): void;
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

  renderContent() {
    if (!this.props.isLoaded) {
      return <div></div>;
    }
    return <div></div>;
  }

  renderSubject() {
    
  }

  render() {
    console.log(this.props.subjects, this.props.selectedSubjects);
    const { sortBy, dateFilter, subjectCategory, setSubjectCategory } = this.props;
    return (
      <Grid
        container item xs={3}
        className="sort-and-filter-container teach-assigned"
      >
        <div className="sort-box">
          <div className="bold font1-5">Sort By</div>
          <div className="sort-radio-btns">
            <FormControlLabel
              checked={sortBy === PSortBy.MostPlayed}
              control={<Radio onClick={() => this.props.setSort(PSortBy.MostPlayed)} className={"filter-radio custom-color"} />}
              label="Most Played" />
            <FormControlLabel
              checked={sortBy === PSortBy.LeastPlayed}
              control={<Radio onClick={() => this.props.setSort(PSortBy.LeastPlayed)} className={"filter-radio custom-color"} />}
              label="Least Played" />
          </div>
        </div>
        <div className="filter-header">Date Filter</div>
        <div className="sort-radio-btns filter-row margin-smaller top-margin-bigger">
          <FormControlLabel
            checked={dateFilter === PDateFilter.Today}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.Today)} className={"filter-radio custom-color"} />}
            label="Today" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={dateFilter === PDateFilter.Past3Days}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.Past3Days)} className={"filter-radio custom-color"} />}
            label="Past 3 days" />
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
            checked={dateFilter === PDateFilter.AllTime}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.AllTime)} className={"filter-radio custom-color"} />}
            label="All time" />
        </div>
        <div className="filter-header">Category</div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.Everything}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.Everything)} className={"filter-radio custom-color"} />}
            label="Everything" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.STEM}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.STEM)} className={"filter-radio custom-color"} />}
            label="STEM" />
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.Humanities}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.Humanities)} className={"filter-radio custom-color"} />}
            label="Humanities" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.General}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.General)} className={"filter-radio custom-color"} />}
            label="General & Topical" />
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.Others}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.Others)} className={"filter-radio custom-color"} />}
            label="Other" />
        </div>
        <div className="filter-header">Subjects</div>
        <div className="flex-center relative select-container">
          <div className="absolute-placeholder">{this.props.selectedSubjects.length === 0 && 'Find a subject'}</div>
          <Select
            className="select-multiple-subject"
            multiple
            MenuProps={{ classes: { paper: 'select-classes-list' } }}
            value={this.state.subjectIds}
            renderValue={(selected) => {
              let text = "";
              for (let s of this.props.selectedSubjects) {
                text += ' ' + s.name;
              }
              return text;
            }}
            onChange={(e) => {
              const values = e.target.value as number[];
              console.log(values);
              let subjects = [];
              for (let id of values) {
                let subject = this.props.subjects.find(s => s.id === id);
                if (subject) {
                  subjects.push(subject);
                }
              }
              this.setState({subjectIds: values});
              this.props.selectSubjects(subjects);
            }}
          >
            {this.props.subjects.map((s: Subject, i) =>
              <MenuItem value={s.id} key={i}>
                <ListItemIcon>
                  <SvgIcon>
                    <SpriteIcon
                      name="circle-filled"
                      className="w100 h100 active"
                      style={{ color: s?.color || '#4C608A' }}
                    />
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText>{s.name}</ListItemText>
              </MenuItem>
            )}
          </Select>
        </div>
        {this.renderContent()}
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default BricksPlayedSidebar;
