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

  renderContent() {
    if (!this.props.isLoaded) {
      return <div></div>;
    }
    return <div></div>;
  }

  renderSubject() {

  }

  render() {
    const { sortBy, dateFilter, subjectCategory, setSubjectCategory } = this.props;
    return (
      <Grid
        container item xs={3}
        className="sort-and-filter-container teach-assigned"
      >
        <div className="sort-box">
          <div className="bold font1-5">Filter By</div>
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
        <div className="filter-header">Category</div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.Everything}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.Everything)} className={"filter-radio custom-color"} />}
            label="Everything" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.Arts}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.Arts)} className={"filter-radio custom-color"} />}
            label="Arts" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.General}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.General)} className={"filter-radio custom-color"} />}
            label="General & Topical" />
        </div>
        <div className="sort-radio-btns full-width filter-row margin-smaller">
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.Humanities}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.Humanities)} className={"filter-radio custom-color"} />}
            label="Humanities & Social Sciences" />
        </div>
        <div className="sort-radio-btns full-width filter-row margin-smaller">
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.Languages}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.Languages)} className={"filter-radio custom-color"} />}
            label="Languages" />
        </div>
        <div className="sort-radio-btns full-width filter-row margin-smaller">
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.Math}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.Math)} className={"filter-radio custom-color"} />}
            label="Maths & Computing" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={subjectCategory === ESubjectCategory.Science}
            control={<Radio onClick={() => setSubjectCategory(ESubjectCategory.Science)} className={"filter-radio custom-color"} />}
            label="Science" />
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
              this.setState({ subjectIds: values });
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
