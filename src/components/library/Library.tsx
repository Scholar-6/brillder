import React, { Component } from "react";
import { Grid, Hidden } from "@material-ui/core";
import { Category } from "../viewAllPage/service/interface";
import { connect } from "react-redux";
import "swiper/swiper.scss";

import './Library.scss';
import { User } from "model/user";
import { Notification } from 'model/notifications';
import { Brick, Subject } from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";
import { getLibraryBricks } from "services/axios/brick";
import { getSubjects } from "services/axios/subject";
import { SortBy, SubjectAssignments } from "./service/model";
import { LibraryAssignmentBrick } from "model/assignment";

import LibraryFilter from "./components/LibraryFilter";
//import ViewAllPagination from "../viewAllPage/ViewAllPagination";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import ExpandedMobileBrick from "components/baseComponents/ExpandedMobileBrickDescription";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { getBrickColor } from "services/brick";
import { getStudentClassrooms } from "services/axios/classroom";
import { TeachClassroom } from "model/classroom";
import LibrarySubjects from "./components/LibrarySubjects";
import LibrarySubject from "./components/LibrarySubject";
import SingleSubjectAssignments from "./singleSubject/SingleSubjectAssignments";


interface BricksListProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
}

interface BricksListState {
  finalAssignments: LibraryAssignmentBrick[];
  rawAssignments: LibraryAssignmentBrick[];
  subjectAssignments: SubjectAssignments[];

  searchString: string;
  isSearching: boolean;

  sortBy: SortBy;
  subjects: any[];
  sortedIndex: number;
  isLoading: boolean;
  classrooms: TeachClassroom[];

  dropdownShown: boolean;

  activeClassroomId: number;
  isClearFilter: boolean;
  isClassClearFilter: boolean;
  failedRequest: boolean;
  pageSize: number;
  isAdmin: boolean;
  shown: boolean;
  subjectChecked: boolean;
}

class Library extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    let isAdmin = false;
    if (this.props.user) {
      isAdmin = checkAdmin(this.props.user.roles);
    }

    this.state = {
      finalAssignments: [],
      rawAssignments: [],
      subjectAssignments: [],
      classrooms: [],
      sortBy: SortBy.Date,
      subjects: [],
      sortedIndex: 0,
      dropdownShown: false,
      searchString: '',
      isSearching: false,
      pageSize: 15,
      isLoading: true,

      activeClassroomId: -1,
      isClearFilter: false,
      isClassClearFilter: false,
      failedRequest: false,
      isAdmin,
      shown: false,
      subjectChecked: false,
    };

    this.loadData();
  }

  // reload subjects and assignments when notification come
  componentDidUpdate(prevProps: BricksListProps) {
    const { notifications } = this.props;
    const oldNotifications = prevProps.notifications;
    if (notifications && oldNotifications) {
      if (notifications.length > oldNotifications.length) {
        this.loadData();
      }
    }
  }

  async loadData() {
    const subjects = await this.loadSubjects();
    let classrooms = await getStudentClassrooms();
    if (classrooms) {
      this.setState({ classrooms });
    }
    await this.getAssignments(subjects);
  }

  async loadSubjects() {
    const subjects = await getSubjects();

    if (subjects) {
      subjects.sort((s1, s2) => s1.name.localeCompare(s2.name));
      return subjects;
    } else {
      this.setState({ failedRequest: true });
    }
    return [];
  }

  countSubjectBricks(subjects: any[], assignments: LibraryAssignmentBrick[]) {
    subjects.forEach((s: any) => {
      s.publicCount = 0;
      s.personalCount = 0;
    });
    for (let a of assignments) {
      for (let s of subjects) {
        if (s.id === a.brick.subjectId) {
          if (a.brick.isCore) {
            s.publicCount += 1;
          } else {
            s.personalCount += 1;
          }
        }
      }
    }
  }

  prepareSubjects(assignments: LibraryAssignmentBrick[], subjects: Subject[]) {
    subjects = subjects.filter(s => assignments.find(a => a.brick.subjectId === s.id));

    this.countSubjectBricks(subjects, assignments);
    return subjects;
  }

  getAssignmentSubjects(assignments: LibraryAssignmentBrick[], subjects: Subject[]) {
    let subjectAssignments: SubjectAssignments[] = [];
    for (let assignment of assignments) {
      const { subjectId } = assignment.brick;
      let subjectFound = false;
      for (let subjectAssignment of subjectAssignments) {
        if (subjectAssignment.subject.id === subjectId) {
          subjectFound = true;
        }
      }
      if (!subjectFound) {
        const subject = subjects.find(s => s.id === subjectId);
        if (subject) {
          subjectAssignments.push({
            subject,
            assignments: []
          });
        } else {
          // error
        }
      }
    }
    this.populateAssignments(subjectAssignments, assignments);
    return subjectAssignments;
  }

  populateAssignments(subjectAssignments: SubjectAssignments[], assignments: LibraryAssignmentBrick[]) {
    for (let assignment of assignments) {
      const subjectAssignment = subjectAssignments.find(s => s.subject.id === assignment.brick.subjectId);
      subjectAssignment?.assignments.push(assignment);
    }
  }

  async getAssignments(subjects: Subject[]) {
    let rawAssignments = await getLibraryBricks<LibraryAssignmentBrick>();
    if (rawAssignments) {
      subjects = this.prepareSubjects(rawAssignments, subjects);
      const finalAssignments = this.filter(rawAssignments, subjects);
      const subjectAssignments = this.getAssignmentSubjects(finalAssignments, subjects);
      this.setState({ ...this.state, subjects, subjectAssignments, isLoading: false, rawAssignments, finalAssignments });
    } else {
      this.setState({ failedRequest: true });
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

  filter(assignments: LibraryAssignmentBrick[], subjects: Subject[]) {
    let filtered: LibraryAssignmentBrick[] = [];

    let filterSubjects = this.getCheckedSubjectIds(subjects);

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

  filterByClassroom = async (id: number) => {
  }

  filterBySubject(id: number) {
    let subjectChecked = true;
    let isChecked = false;
    const subject = this.state.subjects.find(s => s.id === id);
    if (subject.checked === true) {
      isChecked = true;
      subjectChecked = false;
    }

    for (let subject of this.state.subjects) {
      subject.checked = false;
    }

    if (subject && !isChecked) {
      subject.checked = true;
    }

    this.setState({ ...this.state, subjectChecked });
  }

  clearSubjects = () => {
    const { state } = this;
    const { subjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    const finalAssignments = this.filter(this.state.rawAssignments, subjects);
    this.setState({ ...state, finalAssignments, isClearFilter: false });
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

  searching(v: string) { }
  async search() { }

  showDropdown() { this.setState({ ...this.state, dropdownShown: true }) }
  hideDropdown() { this.setState({ ...this.state, dropdownShown: false }) }

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
    let color = getBrickColor(brick);

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

  renderMainTitle(filterSubjects: number[]) {
    if (filterSubjects.length === 1) {
      const subjectId = filterSubjects[0];
      const subject = this.state.subjects.find(s => s.id === subjectId);
      return subject.name;
    } else if (filterSubjects.length > 1) {
      return "Filtered";
    }
    const { activeClassroomId } = this.state;
    if (activeClassroomId > 0) {
      const classroom = this.state.classrooms.find(c => c.id === activeClassroomId);
      if (classroom) {
        return classroom.name;
      }
    }
    return "My Library";
  }

  renderContent() {
    if (this.state.subjectChecked) {
      const subject = this.state.subjects.find(s => s.checked === true);
      if (subject) {
        const subjectAssignment = this.state.subjectAssignments.find(sa => sa.subject.id === subject.id);
        if (subjectAssignment) {
          return <SingleSubjectAssignments userId={this.props.user.id} subjectAssignment={subjectAssignment} history={this.props.history} />
        }
      }
    }
    return (
      <div className="bricks-list-container bricks-container-mobile">
        <LibrarySubjects
          userId={this.props.user.id}
          subjects={this.state.subjects}
          pageSize={this.state.pageSize}
          sortedIndex={this.state.sortedIndex}
          subjectAssignments={this.state.subjectAssignments}
          history={this.props.history}
        />
      </div>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <PageLoader content="...Getting Bricks..." />;
    }
    const filterSubjects = this.getCheckedSubjectIds(this.state.subjects);
    const { history } = this.props;
    return (
      <div className="main-listing dashboard-page my-library">
        {this.renderMobileGlassIcon()}
        <PageHeadWithMenu
          page={PageEnum.MyLibrary}
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
              classrooms={this.state.classrooms}
              subjects={this.state.subjects}
              assignments={this.state.rawAssignments}
              isClearFilter={this.state.isClearFilter}
              isClassClearFilter={this.state.isClassClearFilter}
              handleSortChange={e => this.handleSortChange(e)}
              clearSubjects={() => this.clearSubjects()}
              filterByClassroom={this.filterByClassroom.bind(this)}
              filterBySubject={this.filterBySubject.bind(this)}
            />
          </Grid>
          <Grid item xs={9} className="brick-row-container">
            <Hidden only={["xs"]}>
              <div className={
                `
                    brick-row-title main-title uppercase
                    ${(filterSubjects.length === 1 || this.state.activeClassroomId > 0) && 'subject-title'}
                  `
              }
              >
                {this.renderMainTitle(filterSubjects)}
              </div>
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
            {this.renderContent()}
            {/* pagination removed temporarily 28/01/2021
            <ViewAllPagination
              pageSize={this.state.pageSize}
              sortedIndex={this.state.sortedIndex}
              bricksLength={this.state.finalAssignments.length}
              moveAllNext={() => this.moveAllNext()}
              moveAllBack={() => this.moveAllBack()}
            />*/}
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

export default connect(mapState)(Library);
