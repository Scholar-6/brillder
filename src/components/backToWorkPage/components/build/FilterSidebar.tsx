import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";
import AnimateHeight from "react-animate-height";

import './FilterSidebar.scss';
import { Brick } from "model/brick";
import { Filters } from '../../model';
import EmptyFilterSidebar from "../EmptyFilter";
import { SubjectItem } from "../personalBuild/model";
import { User } from "model/user";


enum FilterFields {
  Draft = 'draft',
  Build = 'build',
  Review = 'review',
  Publish = 'publish',
  Level1 = 'level1',
  Level2 = 'level2',
  Level3 = 'level3',
  s20 = 's20',
  s40 = 's40',
  s60 = 's60',
}

interface FilterSidebarProps {
  history: any;
  user: User;
  draftCount: number;
  buildCount: number;
  reviewCount: number;

  filters: Filters;
  isEmpty: boolean;
  subjects: SubjectItem[];
  filterChanged(filters: Filters): void;
  filterBySubject(s: any): void;
}

interface FilterSidebarState {
  filterExpanded: boolean;
  isClearFilter: boolean;

  isSubjectsClear: boolean;
  subjectsHeight: string;

  subjectCheckedId: number;
}

class FilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      filterExpanded: true,
      isClearFilter: false,
      subjectsHeight: 'auto',
      isSubjectsClear: false,
      subjectCheckedId: -1,
    }
  }

  removeSubject() {
    this.setState({ ...this.state, subjectCheckedId: -1 });
    this.props.filterBySubject(null);
  }

  filterBySubject(s: SubjectItem) {
    let isChecked = false;
    for (let item of this.props.subjects) {
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
    this.setState({ ...this.state, subjectCheckedId: isChecked ? s.id : -1 });
    if (isChecked) {
      this.props.filterBySubject(s);
    } else {
      this.props.filterBySubject(null);
    }
  }

  toggleFilter(filter: FilterFields) {
    const { filters } = this.props;
    filters[filter] = !filters[filter];
    this.filterClear();
    this.props.filterChanged(filters);
    console.log('filter changed')
  }

  filterClear() {
    let { draft, review, build } = this.props.filters
    if (draft || review || build) {
      this.setState({ isClearFilter: true })
    } else {
      this.setState({ isClearFilter: false })
    }
  }

  renderInbox = () => {
    return (
      <div>
        <div className="filter-container sort-by-box">
          <div className="sort-header">Inbox</div>
        </div>
        <div className="filter-container subject-indexes-box first">
          <div className="index-box color1">
            <FormControlLabel
              checked={this.props.filters.draft}
              control={<Radio onClick={() => this.toggleFilter(FilterFields.Draft)} className={"filter-radio custom-color"} />}
              label="Draft" />
            <div className="right-index">{this.props.draftCount}</div>
          </div>
          <div className="index-box color2">
            <FormControlLabel
              checked={this.props.filters.build}
              control={<Radio onClick={() => this.toggleFilter(FilterFields.Build)} className={"filter-radio custom-color"} />}
              label="Submitted for Review" />
            <div className="right-index">{this.props.buildCount}</div>
          </div>
          <div className="index-box color5">
            <FormControlLabel
              checked={this.props.filters.review}
              control={<Radio onClick={e => this.toggleFilter(FilterFields.Review)} className={"filter-radio custom-color"} />}
              label="Pending Publication" />
            <div className="right-index">{this.props.reviewCount}</div>
          </div>
        </div>
      </div>
    );
  };

  renderViewAll = () => {
    return (
      <div className="filter-container indexes-box">
        <div
          className={"index-box " + (this.state.subjectCheckedId === -1 ? "active" : "")}
          onClick={this.removeSubject.bind(this)}
        >
          View All
        </div>
      </div>
    );
  }

  renderSubjectsBox = () => {
    return (
      <AnimateHeight
        duration={500}
        height={this.state.subjectsHeight}
      >
        <div className="filter-container subjects-list indexes-box">
          {this.renderViewAll()}
          {this.props.subjects.map((s, i) =>
            <div
              className={"index-box hover-light " + (s.id === this.state.subjectCheckedId ? "active" : "")}
              onClick={() => this.filterBySubject(s)} key={i}
            >
              {s.name}
            </div>
          )}
        </div>
      </AnimateHeight>
    );
  };

  render() {
    if (this.props.isEmpty) {
      return <EmptyFilterSidebar history={this.props.history} isCore={true} />;
    }

    return (
      <Grid container item xs={3} className="sort-and-filter-container build-filter">
        <div className="flex-height-box">
          <div className="sort-box">
            <div>
              {this.renderInbox()}
              <div className="filter-header">
                <span>Subjects</span>
              </div>
            </div>
          </div>
          <div className="sort-box subject-scrollable">
            {this.renderSubjectsBox()}
          </div>
        </div>
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default FilterSidebar;
