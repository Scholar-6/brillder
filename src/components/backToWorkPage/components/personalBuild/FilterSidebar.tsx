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
  subjectCheckedId: number;
  subjects: SubjectItem[];
}

class FilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);

    this.state = {
      subjectCheckedId: -1,
      subjects: this.getBrickSubjects(props.bricks)
    }
  }

  componentDidUpdate(prevProps: FilterSidebarProps) {
    if (this.props.bricks !== prevProps.bricks) {
      this.setState({subjects: this.getBrickSubjects(this.props.bricks)});
    }
  }

  getBrickSubjects(bricks: Brick[]) {
    let subjects:SubjectItem[] = [];
    for (let brick of bricks) {
      if (!brick.subject) {
        continue;
      }
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

        if (item.id === this.state.subjectCheckedId) {
          item.checked = false;
        } else {
          item.checked = true;
          isChecked = true;
        }
      } else {
        item.checked = false;
      }
    }
    this.setState({...this.state, subjectCheckedId: isChecked ? s.id : -1});
    if (isChecked) {
      this.props.filterBySubject(s);
    } else {
      this.props.filterBySubject(null);
    }
  }

  setViewAll() {
    for (const s of this.state.subjects) {
      s.checked = false;
    }
    this.setState({...this.state, subjectCheckedId: -1});
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

  renderIndexesBox() {
    return (
      <div>
        <div className="filter-container sort-by-box">
          <div className="sort-header">INBOX</div>
        </div>
        {this.renderSortAndFilterBox()}
        <div className="filter-container indexes-box">
          <div className="filter-header" style={{marginBottom: 0}}>
            SUBJECTS
          </div>
        </div>
      </div>
    );
  }

  renderSortAndFilterBox = () => {
    const {filters} = this.props;
    return (
      <div className="filter-container subject-indexes-box first">
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
    );
  };

  render() {
    if (this.props.isEmpty) {
      return <EmptyFilterSidebar history={this.props.history} isCore={false} />;
    }

    return (
      <Grid container item xs={3} className="sort-and-filter-container personal-build-filter">
        <div className="flex-height-box">
          <div className="sort-box">
            {this.renderIndexesBox()}
          </div>
          <div className="sort-box subject-scrollable">
            <div className="filter-container subjects-list indexes-box">
              <div className={"index-box hover-light " + (this.state.subjectCheckedId === -1 ? "active" : "")} onClick={() => this.setViewAll()}>
                View All <div className="right-index">{this.props.bricks.length}</div>
              </div>
              {this.state.subjects.map((s, i) =>
                <div className={"index-box hover-light " + (s.id === this.state.subjectCheckedId ? "active" : "")} onClick={() => this.filterBySubject(s)} key={i}>
                  {s.name}
                  <div className="right-index">{s.count}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default FilterSidebar;
