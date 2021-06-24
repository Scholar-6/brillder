import React, { Component } from "react";
import { connect } from "react-redux";
import "swiper/swiper.scss";

import { User } from "model/user";
import { Notification } from 'model/notifications';
import { SubjectAItem } from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";
import { getLibraryBricks } from "services/axios/brick";
import { getSubjects } from "services/axios/subject";
import { SubjectAssignments } from "./service/model";
import { LibraryAssignmentBrick } from "model/assignment";

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import LibraryPhoneSubjects from "./components/LibraryPhoneSubjects";

interface BricksListProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
}


interface BricksListState {
  rawAssignments: LibraryAssignmentBrick[];
  subjectAssignments: SubjectAssignments[];

  searchString: string;
  isSearching: boolean;

  dropdownShown: boolean;
  isLoading: boolean;
  failedRequest: boolean;
  isAdmin: boolean;
}

const MobileTheme = React.lazy(() => import('./themes/MyLibraryPageMobileTheme'));

class Library extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    let isAdmin = false;
    if (this.props.user) {
      isAdmin = checkAdmin(this.props.user.roles);
    }

    this.state = {
      rawAssignments: [],
      subjectAssignments: [],
      dropdownShown: false,
      searchString: '',
      isSearching: false,
      isLoading: true,

      failedRequest: false,
      isAdmin,
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

  prepareSubjects(assignments: LibraryAssignmentBrick[], subjects: SubjectAItem[]) {
    return subjects.filter(s => assignments.find(a => a.brick.subjectId === s.id));
  }
  
  populateAssignments(subjectAssignments: SubjectAssignments[], assignments: LibraryAssignmentBrick[]) {
    for (let assignment of assignments) {
      const subjectAssignment = subjectAssignments.find(s => s.subject.id === assignment.brick.subjectId);
      subjectAssignment?.assignments.push(assignment);
    }
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

  async getAssignments(subjects: SubjectAItem[]) {
    const rawAssignments = await getLibraryBricks<LibraryAssignmentBrick>();
    if (rawAssignments) {
      subjects = this.prepareSubjects(rawAssignments, subjects);
      const subjectAssignments = this.getAssignmentSubjects(rawAssignments, subjects);
      this.setState({
        ...this.state, subjectAssignments, isLoading: false, rawAssignments
      });
    } else {
      this.setState({ failedRequest: true });
    }
  }

  searching(v: string) { }
  async search() { }

  showDropdown() { this.setState({ ...this.state, dropdownShown: true }) }
  hideDropdown() { this.setState({ ...this.state, dropdownShown: false }) }

  render() {
    if (this.state.isLoading) {
      return <PageLoader content="...Getting Bricks..." />;
    }
    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />
        <div className="main-listing dashboard-page phone-my-library">
          <PageHeadWithMenu
            page={PageEnum.MyLibrary}
            user={this.props.user}
            placeholder={"Search Ongoing Projects & Published Bricks…"}
            history={this.props.history}
            search={() => this.search()}
            searching={(v) => this.searching(v)}
          />
          <div className="ml-content">
            <div className="ml-title">
              My Library
            </div>
            <div className="bricks-list-container bricks-container-mobile all-subject-assignments">
              <LibraryPhoneSubjects
                userId={this.props.user.id}
                subjectAssignments={this.state.subjectAssignments}
                history={this.props.history}
              />
            </div>
          </div>
          <FailedRequestDialog
            isOpen={this.state.failedRequest}
            close={() => this.setState({ ...this.state, failedRequest: false })}
          />
        </div>
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

export default connect(mapState)(Library);
