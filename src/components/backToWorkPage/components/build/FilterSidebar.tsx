import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { Brick, BrickStatus } from "model/brick";
import { SortBy, Filters, ThreeColumns } from '../../model';
import { clearStatusFilters } from '../../service';
import EmptyFilterSidebar from "../EmptyFilter";
import CustomFilterBox from "components/library/CustomFilterBox";
import { SubjectItem } from "../personalBuild/model";
import AnimateHeight from "react-animate-height";


enum FilterFields {
  Draft = 'draft',
  Build = 'build',
  Review = 'review',
  Publish = 'publish'
}

interface FilterSidebarProps {
  history: any;
  userId: number;
  finalBricks: Brick[];
  threeColumns: ThreeColumns;
  filters: Filters;
  sortBy: SortBy;
  isEmpty: boolean;
  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  showAll(): void;
  showBuildAll(): void;
  showEditAll(): void;
  filterChanged(filters: Filters): void;
  filterBySubject(s: any): void;
}

interface FilterSidebarState {
  filterExpanded: boolean;
  isClearFilter: boolean;

  isSubjectsClear: boolean;
  subjectsHeight: string;

  subjectCheckedId: number;
  subjects: SubjectItem[];
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
      subjects: this.getBrickSubjects(props.finalBricks)
    }
  }

  componentDidUpdate(prevProps: FilterSidebarProps) {
    if (this.props.finalBricks !== prevProps.finalBricks) {
      this.setState({subjects: this.getBrickSubjects(this.props.finalBricks)});
    }
  }

  getBrickSubjects(bricks: Brick[]) {
    let subjects:SubjectItem[] = [];
    for (let brick of bricks) {
      if (!brick.subject) {
        continue;
      }
      if (this.props.filters.publish === true) {
        if (brick.status !== BrickStatus.Publish) {
          continue;
        }
      } else {
        if (brick.status === BrickStatus.Publish) {
          continue;
        }
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
    if (this.state && this.state.subjects) {
      for (let stateSubject of this.state.subjects) {
        let found = false;
        for (let subject of subjects) {
          if (subject.id === stateSubject.id) {
            found = true;
            break;
          }
        }
        if (found === false) {
          subjects.push(stateSubject);
        }
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

  showAll() {
    for (let s of this.state.subjects) {
      s.checked = false;
    }
    this.setState({...this.state, subjectCheckedId: -1});
    this.props.showAll();
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

  renderInbox = () => {
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">INBOX</div>
        </div>
      </div>
    );
  };

  renderSortAndFilterBox = (draft: number, build: number, review: number, viewAll: number) => {
    return (
      <div className="sort-box">
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
        <CustomFilterBox
          label="Subjects"
          isClearFilter={this.state.isSubjectsClear}
          setHeight={subjectsHeight => this.setState({subjectsHeight})}
          clear={() => {}}
        />
        <AnimateHeight
          duration={500}
          height={this.state.subjectsHeight}
          style={{ width: "100%" }}
        >
          <div className="filter-container subjects-list indexes-box">
            <div className="filter-container indexes-box">
              <div className={"index-box " + (this.props.filters.viewAll ? "active" : "")} onClick={this.showAll.bind(this)}>
                View All
                <div className="right-index">{viewAll}</div>
              </div>
            </div>
            {this.state.subjects.map((s, i) =>
              <div className={"index-box hover-light " + (s.id === this.state.subjectCheckedId ? "active" : "")} onClick={() => this.filterBySubject(s)} key={i}>
                {s.name}
                <div className="right-index">{s.count}</div>
              </div>
            )}
          </div>
        </AnimateHeight>
      </div>
    );
  };

  render() {
    if (this.props.isEmpty) {
      return <EmptyFilterSidebar history={this.props.history} />;
    }

    let draft = 0;
    let build = 0;
    let publication = 0;
    let viewAll = 0;

    const {threeColumns, finalBricks} = this.props;

    if (this.props.filters.viewAll) {
      draft = threeColumns.red.finalBricks.length;
      build = threeColumns.yellow.finalBricks.length;
      publication = threeColumns.green.finalBricks.length;
      viewAll = draft + build + publication;
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
      viewAll = draft + build + publication;
    }

    if (this.props.filters.publish) {
      for (let b of finalBricks) {
        if (b.status === BrickStatus.Publish) {
          viewAll += 1;
        }
      }
    }

    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        {this.renderInbox()}
        {!this.props.filters.publish && this.renderSortAndFilterBox(draft, build, publication, viewAll)}
      </Grid>
    );
  }
}

export default FilterSidebar;
