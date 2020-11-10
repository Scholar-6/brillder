import React, { Component } from "react";
import { Grid } from "@material-ui/core";

import { Brick } from "model/brick";
import { PersonalFilters, SubjectItem } from "./model";
import FilterToggle from "./FilterToggle";
import EmptyFilterSidebar from "../EmptyFilter";

interface FilterSidebarProps {
  history: any;
  draft: number;
  isEmpty: boolean;
  selfPublish: number;
  bricks: Brick[];
  filters: PersonalFilters;
  setFilters(filters: PersonalFilters): void;
  filterBySubject(subject: SubjectItem | null): void;
}

interface FilterSidebarState {
  subjectChecked: boolean;
  subjects: SubjectItem[];
}

class FilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);

    this.state = {
      subjectChecked: false,
      subjects: this.getBrickSubjects(props.bricks)
    }
  }

  getBrickSubjects(bricks: Brick[]) {
    let subjects:SubjectItem[] = [];
    for (let brick of bricks) {
      let subject = subjects.find(s => s.id === brick.subject?.id);
      if (!subject) {
        let subject = Object.assign({}, brick.subject) as SubjectItem;
        subject.count = 1;
        subjects.push(subject);
      } else {
        subject.count += 1;
      }
    }
    return subjects;
  }

  filterBySubject(s: SubjectItem) {
    let isChecked = false;
    for (let item of this.state.subjects) {
      if (item.id === s.id) {
        item.checked = !item.checked;
        if (item.checked === true) {
          isChecked = true;
        }
      } else {
        item.checked = false;
      }
    }
    this.setState({...this.state, subjectChecked: isChecked});
    if (isChecked) {
      this.props.filterBySubject(s);
    } else {
      this.props.filterBySubject(null);
    }
  }

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
          <div className={"index-box " + (!this.state.subjectChecked ? "active" : "")} onClick={this.setViewAll}>
            View All
            <div className="right-index">{this.props.bricks.length}</div>
          </div>
          <div className="filter-header">
            SUBJECTS
          </div>
          {subjects.map((s, i) => 
            <div className={"index-box " + (s.checked ? "active" : "")} onClick={() => this.filterBySubject(s)} key={i}>
              {s.name}
              <div className="right-index">{s.count}</div>
            </div>
          )}
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
    if (this.props.isEmpty) {
      return <EmptyFilterSidebar history={this.props.history} />;
    }

    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        {this.renderIndexesBox(this.state.subjects)}
        {this.renderSortAndFilterBox()}
      </Grid>
    );
  }
}

export default FilterSidebar;
