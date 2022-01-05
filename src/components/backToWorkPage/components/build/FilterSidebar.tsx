import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";
import AnimateHeight from "react-animate-height";

import './FilterSidebar.scss';
import { AcademicLevel, AcademicLevelLabels, Brick, BrickLengthEnum, BrickStatus } from "model/brick";
import { SortBy, Filters, ThreeColumns } from '../../model';
import { clearStatusFilters } from '../../service';
import EmptyFilterSidebar from "../EmptyFilter";
import { SubjectItem } from "../personalBuild/model";
import { User } from "model/user";
import { checkBuilder, isAorP } from "components/services/brickService";
import HoverHelp from "components/baseComponents/hoverHelp/HoverHelp";
import LevelHelpContent from "components/baseComponents/hoverHelp/LevelHelpContent";
import { filter } from "components/assignmentsPage/components/play/service";


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
  finalBricks: Brick[];
  threeColumns: ThreeColumns;
  filters: Filters;
  sortBy: SortBy;
  isEmpty: boolean;
  subjects: SubjectItem[];
  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
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

  showAll() {
    for (let s of this.props.subjects) {
      s.checked = false;
    }
    this.setState({ ...this.state, subjectCheckedId: -1 });
    this.props.filterBySubject(null);
  }

  hideFilter() { this.setState({ filterExpanded: false }) }
  expandFilter() { this.setState({ filterExpanded: true }) }

  toggleFilter(filter: FilterFields) {
    const { filters } = this.props;
    filters[filter] = !filters[filter];
    this.filterClear();
    this.props.filterChanged(filters);
  }

  clearStatus() {
    const { filters } = this.props;
    clearStatusFilters(filters);
    this.filterClear();
    this.props.filterChanged(filters);
  }

  filterClear() {
    let { draft, review, build } = this.props.filters
    if (draft || review || build) {
      this.setState({ isClearFilter: true })
    } else {
      this.setState({ isClearFilter: false })
    }
  }

  renderInbox = (draft: number, build: number, review: number) => {
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
            <div className="right-index">{draft}</div>
          </div>
          <div className="index-box color2">
            <FormControlLabel
              checked={this.props.filters.build}
              control={<Radio onClick={() => this.toggleFilter(FilterFields.Build)} className={"filter-radio custom-color"} />}
              label="Submitted for Review" />
            <div className="right-index">{build}</div>
          </div>
          <div className="index-box color5">
            <FormControlLabel
              checked={this.props.filters.review}
              control={<Radio onClick={e => this.toggleFilter(FilterFields.Review)} className={"filter-radio custom-color"} />}
              label="Pending Publication" />
            <div className="right-index">{review}</div>
          </div>
        </div>
      </div>
    );
  };

  renderViewAll = (viewAll: number) => {
    return (
      <div className="filter-container indexes-box">
        <div
          className={"index-box " + (this.state.subjectCheckedId === -1 ? "active" : "")}
          onClick={this.removeSubject.bind(this)}
        >
          View All
          <div className="right-index outline-box">{viewAll}</div>
        </div>
      </div>
    );
  }

  renderSubjectsBox = (viewAll: number) => {
    return (
      <AnimateHeight
        duration={500}
        height={this.state.subjectsHeight}
      >
        <div className="filter-container subjects-list indexes-box">
          {this.renderViewAll(viewAll)}
          {this.props.subjects.map((s, i) =>
            <div
              className={"index-box hover-light " + (s.id === this.state.subjectCheckedId ? "active" : "")}
              onClick={() => this.filterBySubject(s)} key={i}
            >
              {s.name}
              <div className="right-index outline-box">{s.count}</div>
            </div>
          )}
        </div>
      </AnimateHeight>
    );
  };

  renderAcademicLevel(checked: boolean, loopLevel: AcademicLevel, level: FilterFields, checked2: boolean, length: FilterFields) {
    return (
      <div>
      <FormControlLabel
        value={SortBy.Popularity}
        style={{ marginRight: 0 }}
        control={
          <Radio
            className="sortBy"
            checked={checked}
            onClick={() => this.toggleFilter(level)}
          />
        }
        label={`Level ${AcademicLevelLabels[loopLevel]}`}
      />
      <div>
      <FormControlLabel
        value={SortBy.Popularity}
        style={{ marginRight: 0 }}
        control={
          <Radio
            className="sortBy"
            checked={checked2}
            onClick={() => this.toggleFilter(length)}
          />
        }
        label={`${length.substring(1)} mins`}
      />
      </div>
      </div>
    );
  }

  renderPublishFilter() {
    const {filters} = this.props;
    const canSee = isAorP(this.props.user.roles) || checkBuilder(this.props.user);
    if (canSee) {
      return (
        <div className="level-filter">
          <div className="filter-header">
            Levels
          </div>
          <div className="level-filter-box">
            {this.renderAcademicLevel(filters.level1, AcademicLevel.First, FilterFields.Level1, filters.s20, FilterFields.s20)}
            {this.renderAcademicLevel(filters.level2, AcademicLevel.Second, FilterFields.Level2, filters.s40, FilterFields.s40)}
            {this.renderAcademicLevel(filters.level3, AcademicLevel.Third, FilterFields.Level3, filters.s60, FilterFields.s60)}
            <div className="absolute-difficult-help">
              <HoverHelp>
                <LevelHelpContent />
              </HoverHelp>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{ height: "10vw" }} />
    );
  }

  render() {
    if (this.props.isEmpty) {
      return <EmptyFilterSidebar history={this.props.history} isCore={true} />;
    }

    let draft = 0;
    let build = 0;
    let publication = 0;

    const { threeColumns, finalBricks, filters } = this.props;

    if (filters.draft && filters.review && filters.build) {
      draft = threeColumns.red.finalBricks.length - 1;
      build = threeColumns.yellow.finalBricks.length;
      publication = threeColumns.green.finalBricks.length;
    } else {
      for (let b of finalBricks) {
        if (b.status === BrickStatus.Draft) {
          draft += 1;
        } else if (b.status === BrickStatus.Build) {
          build += 1;
        } else if (b.status === BrickStatus.Review) {
          publication += 1;
        }
      }
    }

    let viewAll = 0;
    for (let subject of this.props.subjects) {
      viewAll += subject.count;
    }

    return (
      <Grid container item xs={3} className="sort-and-filter-container build-filter">
        <div className="flex-height-box">
          <div className="sort-box">
            <div>
              {!this.props.filters.publish
                ? this.renderInbox(draft, build, publication)
                : this.renderPublishFilter()
              }
              <div className="filter-header">
                <span>Subjects</span>
              </div>
            </div>
          </div>
          <div className="sort-box subject-scrollable">
            {this.renderSubjectsBox(viewAll)}
          </div>
        </div>
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default FilterSidebar;
