import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { Brick } from "model/brick";
import { PersonalFilters, SubjectItem } from "./model";
import FilterToggle from "./FilterToggle";

interface FilterSidebarProps {
  draft: number;
  selfPublish: number;
  bricks: Brick[];
  filters: PersonalFilters;
  setFilters(filters: PersonalFilters): void;
}

interface FilterSidebarState {
}

class FilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  setViewAll() {
    this.props.setFilters({draft: true, selfPublish: true});
  }

  toggleDraft() {
    const {filters} = this.props;
    filters.draft = !filters.draft;
    this.props.setFilters(filters);
  }

  toggleSelfPublish() {
    const {filters} = this.props;
    filters.selfPublish = !filters.selfPublish;
    this.props.setFilters(filters);
  }

  renderIndexesBox(subjects: SubjectItem[]) {
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">INBOX</div>
        </div>
        <div className="filter-container indexes-box" style={{height: '40vh', overflowY: 'auto'}}>
          <div className={"index-box " + (true ? "active" : "")} onClick={this.setViewAll}>
            View All
            <div className="right-index">{this.props.bricks.length}</div>
          </div>
          {subjects.map((s, i) => 
            <div className={"index-box " + (false ? "active" : "")} onClick={()=>{}} key={i}>
              {s.name}
              <div className="right-index">{s.count}</div>
            </div>)}
        </div>
      </div>
    );
  }

  renderSortAndFilterBox = () => {
    const {filters} = this.props;
    return (
      <div className="sort-box">
        <div className="filter-header" style={{marginTop: '5vh', marginBottom: '3vh'}}>
          <span>FILTER</span>
        </div>
        <div className="filter-container subject-indexes-box">
          <FilterToggle
            color="color1"
            checked={filters.draft}
            onClick={this.toggleDraft.bind(this)}
            label="Draft"
            count={this.props.draft} />
          <FilterToggle
            color="color7"
            checked={filters.selfPublish}
            onClick={this.toggleSelfPublish.bind(this)}
            label="Self-Published"
            count={this.props.selfPublish} />
        </div>
      </div>
    );
  };

  render() {
    let subjects:SubjectItem[] = [];
    for (let brick of this.props.bricks) {
      let subject = subjects.find(s => s.id === brick.subject?.id);
      if (!subject) {
        let subject = Object.assign({}, brick.subject) as SubjectItem;
        subject.count = 1;
        subjects.push(subject);
      } else {
        subject.count += 1;
      }
    }
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        {this.renderIndexesBox(subjects)}
        {this.renderSortAndFilterBox()}
      </Grid>
    );
  }
}

export default FilterSidebar;
