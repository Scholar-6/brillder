import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";
import { ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';

import { Subject } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { CDomain } from "../classesEvents/ClassesSidebar";

export enum PDateFilter {
  Past24Hours,
  PastWeek,
  PastMonth,
  PastYear,
  AllTime
}

interface FilterSidebarProps {
  isLoaded: boolean;
  dateFilter: PDateFilter;
  allDomains: boolean;
  domains: CDomain[];
  setAllDomains(): void;
  setDomain(d: CDomain): void;
  setDateFilter(filter: PDateFilter): void;
  subjects: Subject[];
  selectedSubjects: Subject[];
  selectSubjects(selectedSubjects: Subject[]): void;
}

interface FilterSidebarState {
  subjectIds: number[];
}

export enum SortClassroom {
  Name,
  Date,
  Assignment
}

class AssignmentsSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      subjectIds: []
    };
  }

  render() {
    const { dateFilter } = this.props;
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
        <div className="filter-header">School Domain</div>
        <div className="filter-domain">
          <div className="sort-radio-btns filter-row margin-smaller">
            <FormControlLabel
              checked={this.props.allDomains === true}
              control={<Radio onClick={() => this.props.setAllDomains()} className={"filter-radio custom-color"} />}
              label="All" />
          </div>
          {this.props.domains.map(d =>
            <div className="sort-radio-btns filter-row margin-smaller">
              <FormControlLabel
                checked={d.checked === true}
                control={<Radio onClick={() => this.props.setDomain(d)} className={"filter-radio custom-color"} />}
                label={d.name} />
            </div>
          )}
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
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default AssignmentsSidebar;
