import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from 'query-string';
import "swiper/swiper.scss";
import { isMobile } from 'react-device-detect';

import { User } from "model/user";
import { Notification } from 'model/notifications';
import { Brick, SubjectAItem } from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";
import { getLibraryBricks } from "services/axios/brick";
import { getSubjects } from "services/axios/subject";
import { SortBy, SubjectAssignments } from "./service/model";
import { LibraryAssignmentBrick } from "model/assignment";
import { getUserById } from 'services/axios/user';

import LibraryFilter from "./components/LibraryFilter";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { getStudentClassrooms } from "services/axios/classroom";
import { TeachClassroom } from "model/classroom";
import LibrarySubjects from "./components/LibrarySubjects";
import SingleSubjectAssignments from "./singleSubject/SingleSubjectAssignments";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { CircularProgressbar } from "react-circular-progressbar";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";


interface BricksListProps {
  user: User;
  notifications: Notification[] | null;
  match: any;
  history: any;
  location: any;
}

interface BricksListState {
  finalAssignments: LibraryAssignmentBrick[];
  rawAssignments: LibraryAssignmentBrick[];
  subjectAssignments: SubjectAssignments[];

  sortBy: SortBy;
  subjects: any[];
  sortedIndex: number;
  isLoading: boolean;
  classrooms: TeachClassroom[];
  student: User | null;

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

const TabletTheme = React.lazy(() => import('./themes/MyLibraryPageTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/MyLibraryPageDesktopTheme'));

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
      sortBy: SortBy.Score,
      subjects: [],
      sortedIndex: 0,
      dropdownShown: false,
      pageSize: 15,
      isLoading: true,
      student: null,

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
    const subjects = await this.loadSubjects() as SubjectAItem[];
    subjects.forEach(s => {
      s.assignedCount = 0;
      s.playedCount = 0;
    })
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

  countSubjectBricks(subjects: SubjectAItem[], assignments: LibraryAssignmentBrick[]) {
    subjects.forEach(s => {
      s.playedCount = 0;
      s.assignedCount = 0;
    });
    for (let a of assignments) {
      for (let s of subjects) {
        if (s.id === a.brick.subjectId) {
          s.assignedCount += 1;
          if (a.maxScore) {
            s.playedCount += 1;
          }
        }
      }
    }
  }

  prepareSubjects(assignments: LibraryAssignmentBrick[], subjects: SubjectAItem[]) {
    subjects = subjects.filter(s => assignments.find(a => a.brick.subjectId === s.id));

    this.countSubjectBricks(subjects, assignments);
    return subjects;
  }

  getAssignmentSubjects(assignments: LibraryAssignmentBrick[], subjects: SubjectAItem[]) {
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

  preselectSubject(subjects: SubjectAItem[]) {
    const values = queryString.parse(this.props.location.search);
    if (values.subjectId) {
      const subject = subjects.find(s => s.id === parseInt(values.subjectId as string));
      if (subject) {
        subject.checked = true;
        return true;
      }
    }
    return false;
  }

  async getAssignments(subjects: SubjectAItem[]) {
    let userId = this.props.user.id;
    var student:User | null = null;
    if (this.props.match.params.userId) {
      userId = this.props.match.params.userId;
      student = await getUserById(userId);
    }
    const rawAssignments = await getLibraryBricks<LibraryAssignmentBrick>(userId);
    if (rawAssignments) {
      subjects = this.prepareSubjects(rawAssignments, subjects);
      const finalAssignments = this.filter(rawAssignments, subjects);
      const subjectAssignments = this.getAssignmentSubjects(finalAssignments, subjects);
      const preselected = this.preselectSubject(subjects);
      if (preselected) {
        this.setState({
          ...this.state, subjects, subjectAssignments, isLoading: false,
          rawAssignments, finalAssignments, subjectChecked: true
        });
      } else {
        this.setState({
          ...this.state, student, subjects, subjectAssignments, isLoading: false, rawAssignments, finalAssignments
        });
      }
    } else {
      this.setState({ failedRequest: true });
    }
  }

  handleSortChange = (e: any) => {
    this.setState({ sortBy: parseInt(e.target.value) });
  };

  getCheckedSubjectIds(subjects: SubjectAItem[]) {
    const filterSubjects = [];
    for (let subject of subjects) {
      if (subject.checked) {
        filterSubjects.push(subject.id);
      }
    }
    return filterSubjects;
  }

  filter(assignments: LibraryAssignmentBrick[], subjects: SubjectAItem[]) {
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

  filterByClassroom = async (id: number) => { }

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
    const {student} = this.state;
    /*eslint-disable-next-line*/
    if (this.props.user.id != this.props.match.params.userId && student) {
      return student.firstName + " " + student.lastName + "'s library";
    }
    return "My Library";
  }

  renderContent() {
    if (this.state.subjectChecked) {
      const subject = this.state.subjects.find(s => s.checked === true);
      if (subject) {
        const subjectAssignment = this.state.subjectAssignments.find(sa => sa.subject.id === subject.id);
        if (subjectAssignment) {
          return <SingleSubjectAssignments userId={this.props.user.id} sortBy={this.state.sortBy} student={this.state.student} subjectAssignment={subjectAssignment} history={this.props.history} />
        }
      }
    }
    return (
      <div className="bricks-list-container bricks-container-mobile all-subject-assignments">
        <LibrarySubjects
          subjects={this.state.subjects}
          sortBy={this.state.sortBy}
          pageSize={this.state.pageSize}
          sortedIndex={this.state.sortedIndex}
          subjectAssignments={this.state.subjectAssignments}
          history={this.props.history}
          student={this.state.student}
          subjectTitleClick={s => this.filterBySubject(s.id)}
        />
      </div>
    );
  }

  renderBook() {
    let number = 0;
    let count = 0;

    if (this.state.subjectChecked) {
      const subject = this.state.subjects.find(s => s.checked === true);
      if (subject) {
        const subjectAssignment = this.state.subjectAssignments.find(sa => sa.subject.id === subject.id);
        if (subjectAssignment) {
          count = subjectAssignment.assignments.length;
          for (let aa of subjectAssignment.assignments) {
            if (aa.bestAttemptPercentScore && aa.bestAttemptPercentScore >= 50) {
              number += 1;
            }
          }
        }
      }
    } else {
      count = this.state.finalAssignments.length;
      for (let aa of this.state.finalAssignments) {
        if (aa.bestAttemptPercentScore && aa.bestAttemptPercentScore >= 50) {
          number += 1;
        }
      }
    }

    return (
      <div className="flex-center">
        <div className="book-green">
          <SpriteIcon name="book-open" />
          <div className="custom-tooltip bold">
            <div>Books Earned / Bricks Attempted</div>
          </div>
        </div>
        <div className="static-numbers">
          <div>{number}</div>
          <div className="smaller-number">/ {count}</div>
        </div>
      </div>
    );
  }

  renderBox() {
    return (
      <div className="flex-center">
        <div className="box-blue circle-container">
          <SpriteIcon name="box" />
          <div className="custom-tooltip bold">
            <div>Subjects Played</div>
          </div>
        </div>
        <div className="static-numbers">
          <div>{this.state.subjects.length}</div>
        </div>
      </div>
    );
  }

  renderLastBox() {
    let number = 0;

    if (this.state.subjectChecked) {
      const subject = this.state.subjects.find(s => s.checked === true);
      if (subject) {
        const subjectAssignment = this.state.subjectAssignments.find(sa => sa.subject.id === subject.id);
        if (subjectAssignment) {
          for (let assignment of subjectAssignment.assignments) {
            number += assignment.numberOfAttempts;
          }
        }
      }
    } else {
      for (let assign of this.state.finalAssignments) {
        number += assign.numberOfAttempts;
      }
    }

    return (
      <div className="flex-center">
        <div className="box-yellow circle-container">
          <SpriteIcon name="play-thick" />
          <div className="custom-tooltip bold">
            <div>Total Plays</div>
          </div>
        </div>
        <div className="static-numbers">
          <div>{number}</div>
        </div>
      </div>
    );
  }

  highestScore() {
    let number = 0;

    if (this.state.subjectChecked) {
      const subject = this.state.subjects.find(s => s.checked === true);
      if (subject) {
        const subjectAssignment = this.state.subjectAssignments.find(sa => sa.subject.id === subject.id);
        if (subjectAssignment) {
          for (let aa3 of subjectAssignment.assignments) {
            if (aa3.bestAttemptPercentScore && aa3.bestAttemptPercentScore > number) {
              number = aa3.bestAttemptPercentScore;
            }
          }
        }
      }
    } else {
      for (let assign of this.state.finalAssignments) {
        if (assign.bestAttemptPercentScore && assign.bestAttemptPercentScore > number) {
          number = assign.bestAttemptPercentScore;
        }
      }
    }

    return (
      <div className="flex-center hs-score">
        <div className="custom-tooltip bold">
          <div>Highest Score</div>
        </div>
        HS
        <div className="score-container-v5">
          <CircularProgressbar
            strokeWidth={12}
            counterClockwise={true}
            value={number}
          />
          <div className="score-absolute">{Math.round(number)}</div>
        </div>
      </div>
    );
  }

  averageScore() {
    let count = 0;
    let number = 0;

    if (this.state.subjectChecked) {
      const subject = this.state.subjects.find(s => s.checked === true);
      if (subject) {
        const subjectAssignment = this.state.subjectAssignments.find(sa => sa.subject.id === subject.id);
        if (subjectAssignment) {
          for (let assign of subjectAssignment.assignments) {
            if (assign.bestAttemptPercentScore && assign.bestAttemptPercentScore >= 50) {
              number += assign.bestAttemptPercentScore;
              count += 1;
            }
          }
        }
      }
    } else {
      for (let assign of this.state.finalAssignments) {
        if (assign.bestAttemptPercentScore && assign.bestAttemptPercentScore >= 50) {
          number += assign.bestAttemptPercentScore;
          count += 1;
        }
      }
    }
    if (count !== 0) {
      number = Math.round(number / count);
    }
    return (
      <div className="flex-center hs-score avg-score">
        <div className="custom-tooltip bold">
          <div>Average Score</div>
        </div>
        AVG.
        <div className="score-container-v5">
          <CircularProgressbar
            strokeWidth={12}
            counterClockwise={true}
            value={number}
          />
          <div className="score-absolute">{Math.round(number)}</div>
        </div>
      </div>
    );
  }

  lowestScore() {
    let number = 100;

    if (this.state.subjectChecked) {
      const subject = this.state.subjects.find(s => s.checked === true);
      if (subject) {
        const subjectAssignment = this.state.subjectAssignments.find(sa => sa.subject.id === subject.id);
        if (subjectAssignment) {
          for (let assign of subjectAssignment.assignments) {
            if (assign.bestAttemptPercentScore && assign.bestAttemptPercentScore >= 0 && assign.bestAttemptPercentScore < number) {
              number = assign.bestAttemptPercentScore;
            }
          }
        }
      }
    } else {
      for (let assign of this.state.finalAssignments) {
        if (assign.bestAttemptPercentScore && assign.bestAttemptPercentScore >= 0 && assign.bestAttemptPercentScore < number) {
          number = assign.bestAttemptPercentScore;
        }
      }
    }
    
    return (
      <div className="flex-center hs-score ls-score">
        <div className="custom-tooltip bold">
          <div>Lowest Score</div>
        </div>
        LS
        <div className="score-container-v5">
          <CircularProgressbar
            strokeWidth={12}
            counterClockwise={true}
            value={number}
          />
          <div className="score-absolute">{Math.round(number)}</div>
        </div>
      </div>
    );
  }


  render() {
    console.log('render', this.props, this.state)
    if (this.state.isLoading) {
      return <PageLoader content="...Getting Bricks..." />;
    }
    const filterSubjects = this.getCheckedSubjectIds(this.state.subjects);
    return (
      <React.Suspense fallback={<></>}>
        {isMobile ? <TabletTheme /> : <DesktopTheme />}
        <div className="main-listing dashboard-page my-library">
          <PageHeadWithMenu
            page={PageEnum.MyLibrary}
            user={this.props.user}
            placeholder="  "
            history={this.props.history}
            search={() => { }}
            searching={() => { }}
          />
          <Grid container direction="row" className="sorted-row">
            <Grid container item xs={3} className="sort-and-filter-container">
              <LibraryFilter
                sortBy={this.state.sortBy}
                subjects={this.state.subjects}
                assignments={this.state.rawAssignments}
                isClearFilter={this.state.isClearFilter}
                isClassClearFilter={this.state.isClassClearFilter}
                handleSortChange={e => this.handleSortChange(e)}
                clearSubjects={() => this.clearSubjects()}
                filterBySubject={this.filterBySubject.bind(this)}
              />
            </Grid>
            <Grid item xs={9} className="brick-row-container">
              <div className={
                `library-title ${(filterSubjects.length === 1 || this.state.activeClassroomId > 0) && 'subject-title'}`
              }>
                <div className="ellipsis-title">
                  {this.renderMainTitle(filterSubjects)}
                </div>
                {this.renderBook()}
                {!this.state.subjectChecked && this.renderBox()}
                {this.renderLastBox()}
                <div className="absolute-scores">
                  {this.highestScore()}
                  {this.averageScore()}
                  {this.lowestScore()}
                </div>
              </div>
              {this.renderContent()}
            </Grid>
          </Grid>
          <FailedRequestDialog
            isOpen={this.state.failedRequest}
            close={() => this.setState({ ...this.state, failedRequest: false })}
          />
        </div>
        <ClassInvitationDialog />
        <ClassTInvitationDialog />
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

export default connect(mapState)(Library);
