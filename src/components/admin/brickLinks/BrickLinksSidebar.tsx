import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { HttpStatus } from "./BrickLinks";

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
  label: string;
  statuses: HttpStatus[];
  uncheckAll(): void;
  toggleStatus(status: HttpStatus): void;
}

class BrickLinksSidebar extends Component<FilterSidebarProps> {
  constructor(props: FilterSidebarProps) {
    super(props);
  }

  render() {
    const status200 = this.props.statuses.find(s => s.status == 200);
    const status404 = this.props.statuses.find(s => s.status == 404);
    const status403 = this.props.statuses.find(s => s.status == 403);

    return (
      <Grid
        container item xs={3}
        className="sort-and-filter-container teach-assigned"
      >
        <div className="sort-box">
          <div className="bold font1-5">{this.props.label}</div>
        </div>
        <div className="filter-header">Status</div>
        {status200 && status404 && status403 &&
          <div className="sort-radio-btns filter-row margin-smaller top-margin-bigger">
            <FormControlLabel
              checked={status200.checked === false && status404.checked === false && status403.checked === false}
              control={<Radio onClick={this.props.uncheckAll} className={"filter-radio custom-color"} />}
              label="All Statuses" />
            <FormControlLabel
              checked={status200.checked === true}
              control={<Radio onClick={() => status200 && this.props.toggleStatus(status200)} className={"filter-radio custom-color"} />}
              label="Loaded" />
          </div>}
        <div className="sort-radio-btns filter-row margin-smaller">
          {status404 &&
            <FormControlLabel
              checked={status404.checked === true}
              control={<Radio onClick={() => status404 && this.props.toggleStatus(status404)} className={"filter-radio custom-color"} />}
              label="Not found" />}
          {status403 &&
            <FormControlLabel
              checked={status403.checked === true}
              control={<Radio onClick={() => status403 && this.props.toggleStatus(status403)} className={"filter-radio custom-color"} />}
              label="Forbidden" />}
        </div>
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default BrickLinksSidebar;
