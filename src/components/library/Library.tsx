import React, { Component } from "react";
import { Grid, Hidden } from "@material-ui/core";
import { Category } from "../viewAllPage/interface";
import { connect } from "react-redux";
import "swiper/swiper.scss";

import { User } from "model/user";
import { Notification } from 'model/notifications';
import { Brick, Subject } from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";
import { getAssignedBricks } from "services/axios/brick";
import { getSubjects } from "services/axios/subject";
import { SortBy } from "./model";
import { AssignmentBrick } from "model/assignment";

import LibraryFilter from "./LibraryFilter";
import ViewAllPagination from "../viewAllPage/ViewAllPagination";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import ExpandedMobileBrick from "components/baseComponents/ExpandedMobileBrickDescription";
import PrivateCoreToggle from "components/baseComponents/PrivateCoreToggle";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import AssignedBricks from "./AssignedBricks";


interface BricksListProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
}

interface BricksListState {
  finalAssignments: AssignmentBrick[];
  rawAssignments: AssignmentBrick[];

  searchString: string;
  isSearching: boolean;

  sortBy: SortBy;
  subjects: any[];
  sortedIndex: number;
  isLoading: boolean;

  dropdownShown: boolean;

  isClearFilter: any;
  failedRequest: boolean;
  pageSize: number;
  isAdmin: boolean;
  isCore: boolean;
  shown: boolean;
}

class ViewAllPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    let isAdmin = false;
    if (this.props.user) {
      isAdmin = checkAdmin(this.props.user.roles);
    }

    this.state = {
      finalAssignments: [],
      rawAssignments: [],
      sortBy: SortBy.Date,
      subjects: [],
      sortedIndex: 0,
      dropdownShown: false,
      searchString: '',
      isSearching: false,
      pageSize: 15,
      isLoading: true,

      isClearFilter: false,
      failedRequest: false,
      isAdmin,
      isCore: true,
      shown: false,
    };

    this.loadData();
  }

  // reload subjects and assignments when notification come
  componentDidUpdate(prevProps: BricksListProps) {
    const {notifications} = this.props;
    const oldNotifications = prevProps.notifications;
    if (notifications && oldNotifications) {
      if (notifications.length > oldNotifications.length) {
        this.loadData();
      }
    }
  }

  async loadData() {
    const subjects = await this.loadSubjects();
    await this.getAssignments(subjects);
  }

  async loadSubjects() {
    const subjects = await getSubjects();

    if(subjects) {
      subjects.sort((s1, s2) => s1.name.localeCompare(s2.name));
      return subjects;
    } else {
      this.setState({ failedRequest: true });
    }
    return [];
  }

  prepareSubjects(assignments: AssignmentBrick[], subjects: Subject[]) {
    subjects = subjects.filter(s => assignments.find(a => a.brick.subjectId === s.id));
      
    subjects.forEach(s => {
      s.publishedBricksCount = 0;
      assignments.forEach(a => {
        if (a.brick.subjectId === s.id) {
          s.publishedBricksCount += 1;
        }
      });
    });

    return subjects;
  }

  async getAssignments(subjects: Subject[]) {
    const rawAssignments = await getAssignedBricks();
    if (rawAssignments) {
      subjects = this.prepareSubjects(rawAssignments, subjects);
      const finalAssignments = this.filter(rawAssignments, subjects, this.state.isCore);
  
      this.setState({...this.state, subjects, isLoading: false, rawAssignments, finalAssignments});
    } else {
      this.setState({failedRequest: true});
    }
  }

  move(brickId: number) {
    this.props.history.push(`/play/brick/${brickId}/intro`);
  }

  handleSortChange = (e: any) => { };

  getCheckedSubjectIds(subjects: Subject[]) {
    const filterSubjects = [];
    for (let subject of subjects) {
      if (subject.checked) {
        filterSubjects.push(subject.id);
      }
    }
    return filterSubjects;
  }

  filter(assignments: AssignmentBrick[], subjects: Subject[], isCore?: boolean) {
    let filtered: AssignmentBrick[] = [];

    let filterSubjects = this.getCheckedSubjectIds(subjects);

    if (isCore) {
      assignments = assignments.filter(a => a.brick.isCore === true);
    } else {
      assignments = assignments.filter(a => !a.brick.isCore)
    }

    if (filterSubjects.length > 0) {
      for (let assignment of assignments) {
        let res = filterSubjects.indexOf(assignment.brick.subjectId);
        if (res !== -1) {
          filtered.push(assignment);
        }
      }
      return filtered;
    }

    return assignments;
  }

  isFilterClear() {
    return this.state.subjects.some(r => r.checked);
  }

  filterBySubject = (i: number) => {
    const { subjects } = this.state;
    subjects[i].checked = !subjects[i].checked;
    const finalAssignments = this.filter(this.state.rawAssignments, subjects, this.state.isCore);
    this.setState({subjects, isClearFilter: this.isFilterClear(), finalAssignments, shown: true });
  };

  clearSubjects = () => {
    const { state } = this;
    const { subjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    this.setState({ ...state, isClearFilter: false });
  };

  moveAllBack() {
    const index = this.state.sortedIndex;
    if (index >= this.state.pageSize) {
      this.setState({ ...this.state, sortedIndex: index - this.state.pageSize });
    }
  }

  moveAllNext() {
    const index = this.state.sortedIndex;
    const { pageSize } = this.state;
    const assignments = this.state.finalAssignments;

    if (index + pageSize <= assignments.length) {
      this.setState({ ...this.state, sortedIndex: index + this.state.pageSize });
    }
  }

  searching(searchString: string) { }
  async search() { }

  showDropdown() { this.setState({ ...this.state, dropdownShown: true }) }
  hideDropdown() { this.setState({ ...this.state, dropdownShown: false }) }


  getBrickColor(brick: Brick) {
    let color = "";

    if (!brick.subject) {
      color = "#B0B0AD";
    } else {
      color = brick.subject.color;
    }
    return color;
  }

  prepareVisibleBricks = (
    sortedIndex: number,
    pageSize: number,
    bricks: Brick[]
  ) => {
    let data: any[] = [];
    let count = 0;
    for (let i = 0 + sortedIndex; i < pageSize + sortedIndex; i++) {
      const brick = bricks[i];
      if (brick) {
        let row = Math.floor(count / 3);
        data.push({ brick, key: i, index: count, row });
        count++;
      }
    }
    return data;
  };

  renderMobileExpandedBrick(brick: Brick) {
    let color = this.getBrickColor(brick);

    return (
      <ExpandedMobileBrick
        brick={brick}
        color={color}
        move={(brickId) => this.move(brickId)}
      />
    );
  }

  renderEmptyCategory(name: string) {
    return (
      <div className="brick-row-title">
        <button className="btn btn-transparent svgOnHover">
          <span>{name}</span>
          <SpriteIcon name="arrow-right" className="active text-theme-dark-blue" />
        </button>
      </div>
    );
  }

  renderMobileGlassIcon() {
    return (
      <div className="page-navigation">
        <div className="btn btn-transparent glasses svgOnHover">
          <SpriteIcon name="glasses" className="w100 h100 active text-theme-dark-blue" />
        </div>
        <div className="breadcrumbs">All</div>
      </div>
    );
  }

  toggleCore() {
    const isCore = !this.state.isCore;
    const finalAssignments = this.filter(this.state.rawAssignments, this.state.subjects, isCore);
    this.setState({isCore, finalAssignments});
  }

  renderMainTitle(filterSubjects: number[]) {
    if (filterSubjects.length === 1) {
      const subjectId = filterSubjects[0];
      const subject = this.state.subjects.find(s => s.id === subjectId);
      return subject.name;
    } else if (filterSubjects.length > 1) {
      return "Filtered";
    }
    return "My Library";
  }

  render() {
    if (this.state.isLoading) {
      return <PageLoader content="...Getting Bricks..." />;
    }
    const filterSubjects = this.getCheckedSubjectIds(this.state.subjects);

    const { history } = this.props;
    return (
      <div className="main-listing dashboard-page">
        {this.renderMobileGlassIcon()}
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          placeholder={"Search Ongoing Projects & Published Bricks…"}
          history={this.props.history}
          search={() => this.search()}
          searching={(v) => this.searching(v)}
        />
        <Grid container direction="row" className="sorted-row">
          <Grid container item xs={3} className="sort-and-filter-container">
            <LibraryFilter
              sortBy={this.state.sortBy}
              subjects={this.state.subjects}
              assignments={this.state.rawAssignments}
              isClearFilter={this.state.isClearFilter}
              handleSortChange={e => this.handleSortChange(e)}
              clearSubjects={() => this.clearSubjects()}
              filterBySubject={index => this.filterBySubject(index)}
            />
          </Grid>
          <Grid item xs={9} className="brick-row-container">
            <Hidden only={["xs"]}>
              <div className="brick-row-title uppercase">
                {this.renderMainTitle(filterSubjects)}
              </div>
              {this.props.user &&
                <PrivateCoreToggle
                  isViewAll={true}
                  isCore={this.state.isCore}
                  onSwitch={() => this.toggleCore()}
                />}
            </Hidden>
            <Hidden only={["sm", "md", "lg", "xl"]}>
              <div
                className="brick-row-title"
                onClick={() => history.push(`/play/dashboard/${Category.New}`)}
              >
                <button className="btn btn-transparent svgOnHover">
                  <span>New</span>
                  <SpriteIcon name="arrow-right" className="active text-theme-dark-blue" />
                </button>
              </div>
            </Hidden>
            <div className="bricks-list-container bricks-container-mobile">
              <AssignedBricks
                user={this.props.user}
                shown={true}
                subjects={this.state.subjects}
                pageSize={this.state.pageSize}
                sortedIndex={this.state.sortedIndex}
                assignments={this.state.finalAssignments}
                history={this.props.history}
              />
            </div>
            {/* <Hidden only={["sm", "md", "lg", "xl"]}>
              {this.renderEmptyCategory("Suggest")}
              {this.renderEmptyCategory("Top in Humanities")}
              {this.renderEmptyCategory("Top in Stem")}
            </Hidden> */}
            <ViewAllPagination
              pageSize={this.state.pageSize}
              sortedIndex={this.state.sortedIndex}
              bricksLength={this.state.finalAssignments.length}
              moveAllNext={() => this.moveAllNext()}
              moveAllBack={() => this.moveAllBack()}
            />
          </Grid>
        </Grid>
        <FailedRequestDialog
          isOpen={this.state.failedRequest}
          close={() => this.setState({ ...this.state, failedRequest: false })}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

export default connect(mapState)(ViewAllPage);
