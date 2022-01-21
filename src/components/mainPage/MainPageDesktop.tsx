import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import queryString from 'query-string';
import 'intro.js/introjs.css';
// @ts-ignore
import { Steps } from 'intro.js-react';
import DynamicFont from 'react-dynamic-font';

import actions from "redux/actions/auth";
import brickActions from "redux/actions/brickActions";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { clearProposal } from "localStorage/proposal";
import map from 'components/map';
import { Notification } from 'model/notifications';
import { checkAdmin } from "components/services/brickService";

import WelcomeComponent from './WelcomeComponent';
import MainPageMenu from "components/baseComponents/pageHeader/MainPageMenu";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog";
import TermsLink from "components/baseComponents/TermsLink";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getAssignedBricks } from "services/axios/brick";
import LockedDialog from "components/baseComponents/dialogs/LockedDialog";
import TeachButton from "./components/TeachButton";
import FirstButton from "./components/FirstButton";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import LibraryButton from "./components/LibraryButton";
import BlocksIcon from "./components/BlocksIcon";
import ReportsAlertDialog from "components/baseComponents/dialogs/ReportsAlertDialog";
import { isIPad13, isMobile, isTablet } from "react-device-detect";
import InvalidDialog from "components/build/baseComponents/dialogs/InvalidDialog";
import { isBuilderPreference, isInstitutionPreference, isStudentPreference, isTeacherPreference } from "components/services/preferenceService";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";



const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  logout: () => dispatch(actions.logout()),
});

const TabletTheme = React.lazy(() => import('./themes/MainPageTablet'));
const DesktopTheme = React.lazy(() => import('./themes/MainPageDesktop'));

const connector = connect(mapState, mapDispatch);

interface MainPageProps {
  history: any;
  user: User;
  notifications: Notification[] | null;
  forgetBrick(): void;
  logout(): void;
}

interface MainPageState {
  createHober: boolean;
  backHober: boolean;
  isPolicyOpen: boolean;
  notificationExpanded: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isBuilder: boolean;

  isNewTeacher: boolean;

  assignedCount: number;

  // for students
  backWorkActive: boolean;
  isMyLibraryOpen: boolean;
  isBackToWorkOpen: boolean;
  isTryBuildOpen: boolean;
  isReportLocked: boolean;

  // for mobile popopup
  isDesktopOpen: boolean;
  secondaryLabel: string;
  secondPart: string;

  // intro
  stepsEnabled: boolean;
  steps: any[];
}

class MainPageDesktop extends Component<MainPageProps, MainPageState> {
  constructor(props: MainPageProps) {
    super(props);

    // onboarding users logic
    let isNewTeacher = false;
    const values = queryString.parse(this.props.history.location.search);
    if (values.newTeacher) {
      isNewTeacher = true;
    }

    const isStudent = isStudentPreference(props.user);
    const isBuilder = isBuilderPreference(props.user);

    this.state = {
      createHober: false,
      backHober: false,
      isPolicyOpen: false,
      notificationExpanded: false,
      backWorkActive: false,
      isMyLibraryOpen: false,
      isBackToWorkOpen: false,
      isTryBuildOpen: false,
      isReportLocked: false,
      isNewTeacher,

      isTeacher: isTeacherPreference(props.user) || isInstitutionPreference(props.user),
      isAdmin: checkAdmin(props.user.roles),
      isStudent,
      isBuilder,

      assignedCount: 0,

      isDesktopOpen: false,
      secondaryLabel: '',
      secondPart: ' not yet been optimised for mobile devices.',
      stepsEnabled: false,
      steps: [{
        element: '.view-item-container',
        intro: `<p>Browse the catalogue, and assign your first brick to a new class</p>`,
      },{
        element: '.view-item-container',
        intro: `<p>Browse the catalogue, and assign your first brick to a new class</p>`,
      }]
    } as any;

    if (isStudent) {
      this.preparationForStudent();
    }
    setTimeout(() => {
      this.setState({stepsEnabled: isNewTeacher});
    }, 300);
  }

  async preparationForStudent() {
    let bricks = await getAssignedBricks();
    if (bricks && bricks.length > 0) {
      this.setState({ backWorkActive: true, assignedCount: bricks.length });
    }
  }

  setPolicyDialog(isPolicyOpen: boolean) {
    this.setState({ isPolicyOpen });
  }

  creatingBrick() {
    clearProposal();
    this.props.forgetBrick();
    this.props.history.push(map.ProposalSubjectLink);
  }

  renderCreateButton(disabled?: boolean) {
    let isActive = true;
    if (disabled) {
      isActive = false;
    }
    if (isIPad13 || isTablet) {
      isActive = false;
      disabled = true;
    }
    return (
      <div className={`create-item-container ${isActive ? '' : 'disabled'}`} onClick={() => {
        if (disabled) {
          if (isMobile) {
            this.setState({isDesktopOpen: true});
          }
          return;
        }
        this.props.history.push(map.backToWorkUserBased(this.props.user));
      }}>
        <button className="btn btn-transparent zoom-item svgOnHover">
          <SpriteIcon name="trowel-home" className={isActive ? 'active text-theme-orange' : 'text-theme-light-blue'} />
          <span className="item-description">Build Bricks</span>
        </button>
      </div>
    );
  }

  renderLibraryButton() {
    const isActive = this.props.user.hasPlayedBrick;
    return (
      <LibraryButton
        isActive={isActive} history={this.props.history}
        onClick={() => this.setState({ isMyLibraryOpen: true })}
      />
    );
  }

  renderStudentWorkButton() {
    const isActive = this.state.backWorkActive;
    const disabledColor = 'text-theme-dark-blue';
    return (
      <div className="back-item-container second-button student-back-work" onClick={() => {
        if (isActive) {
          this.props.history.push(map.AssignmentsPage);
        } else {
          this.setState({ isBackToWorkOpen: true });
        }
      }}>
        <button className={`btn btn-transparent ${isActive ? 'active zoom-item text-theme-orange' : disabledColor}`}>
          <BlocksIcon disabled={!isActive} />
          <span className={`item-description flex-number ${isActive ? '' : 'disabled'}`}>
            My Assignments {this.state.assignedCount > 0 &&
            <div className="m-red-circle">
              <DynamicFont content={this.state.assignedCount.toString()} />
            </div>}
          </span>
        </button>
      </div>
    );
  }

  renderSecondButton() {
    if (this.state.isTeacher || this.state.isAdmin) {
      const isIpad = isIPad13 || isTablet;
      return <TeachButton history={this.props.history} disabled={this.state.isNewTeacher || isIpad} onMobileClick={() => this.setState({isDesktopOpen: true})} />
    } else if (this.state.isStudent) {
      return this.renderStudentWorkButton();
    }
    return this.renderCreateButton();
  }

  renderThirdButton() {
    if (this.state.isTeacher) {
      return this.renderTryBuildButton(true && !this.state.isNewTeacher);
    } else if (this.state.isBuilder && !this.state.isAdmin) {
      return this.renderLibraryButton();
    } else if (this.state.isStudent) {
      return this.renderLibraryButton();
    } else if (this.state.isAdmin) {
      return this.renderCreateButton();
    }
    return this.renderAssignmentsButton();
  }

  renderAssignmentsButton() {
    return (
      <div className="back-item-container" onClick={() => {
        this.props.history.push(map.AssignmentsPage);
      }}>
        <button className="btn btn-transparent text-theme-orange zoom-item">
          <BlocksIcon />
          <span className="item-description">Assignments</span>
        </button>
      </div>
    );
  }

  renderLiveAssignmentButton(isActive: boolean) {
    let className = 'back-item-container student-back-work'
    if (!isActive) {
      className += ' disabled';
    }
    return (
      <div className={className} onClick={() => {
        if (isActive) {
          this.props.history.push(map.AssignmentsPage);
        } else {
          this.setState({ isBackToWorkOpen: true });
        }
      }}>
        <button className={`btn btn-transparent ${isActive ? 'active zoom-item text-theme-orange' : 'text-theme-light-blue'}`}>
          <BlocksIcon disabled={!isActive} />
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>Shared with Me</span>
        </button>
      </div>
    );
  }

  renderReportsButton(isActive: boolean) {
    return (
      <div className="back-item-container student-back-work" onClick={() => {
        this.setState({ isReportLocked: true });
      }}>
        <button className={`btn btn-transparent ${isActive ? 'active zoom-item text-theme-orange' : 'text-theme-light-blue'}`}>
          <SpriteIcon name="book-open" />
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>Reports</span>
        </button>
      </div>
    );
  }

  renderTryBuildButton(isActive: boolean) {
    let disabled = false;
    let className = "create-item-container";
    if (isTablet || isIPad13) {
      isActive = false;
      disabled = true;
    }

    if (!isActive) {
      className += ' disabled';
    }
    return (
      <div className={className} onClick={() => {
        if (disabled) {
          if (isMobile) {
            this.setState({isDesktopOpen: true});
          }
          return;
        }
        if (!isActive) {
          this.setState({ isTryBuildOpen: true });
        } else {
          this.props.history.push(map.backToWorkUserBased(this.props.user));
        }
      }}>
        <button className={`btn btn-transparent ${isActive ? 'zoom-item text-theme-orange active' : 'text-theme-light-blue'}`}>
          <SpriteIcon name="trowel-home" />
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>Build Bricks</span>
        </button>
      </div>
    );
  }

  renderRightButton() {
    if (this.state.isBuilder) {
      // Removed brick stats because it doesnt exist yet 11/10/21
      // let isActive = false;
      // return (
      //   <div className="create-item-container stats">
      //     <button className={`btn btn-transparent ${isActive ? 'zoom-item text-theme-orange active' : 'text-theme-light-blue'}`}>
      //       <SpriteIcon name="f-trending-up" />
      //       <span className={`item-description ${isActive ? '' : 'disabled'}`}>Brick Stats</span>
      //     </button>
      //   </div>
      // );
      return ""
    }
    let isActive = this.props.user.hasPlayedBrick;
    if (this.state.isTeacher) {
      return this.renderLiveAssignmentButton(true && !this.state.isNewTeacher);
    } else if (this.state.isStudent) {
      return this.renderTryBuildButton(isActive);
    } else if (this.state.isAdmin) {
      return this.renderAssignmentsButton();
    }
    return "";
  }

  renderRightBottomButton() {
    if (this.state.isTeacher) {
      return this.renderReportsButton(false);
    } else if (this.state.isAdmin) {
      if (this.state.isStudent) {
        return this.renderAssignmentsButton();
      }
      return this.renderLibraryButton();
    }
    return "";
  }

  onIntroExit() {
    this.setState({stepsEnabled: false});
  }

  onIntroChanged(e: any) {
    if (e !== 0) {
      this.props.history.push(map.ViewAllPage + '?mySubject=true&newTeacher=true');
      this.setState({stepsEnabled: false});
    }
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        {isTablet ? <TabletTheme/> : <DesktopTheme /> }
        <Grid container direction="row" className="mainPage">
        <div className="welcome-col">
          <WelcomeComponent
            user={this.props.user}
            history={this.props.history}
            notifications={this.props.notifications}
            notificationClicked={() => this.setState({ notificationExpanded: !this.state.notificationExpanded })}
          />
        </div>
        <div className="first-col">
          <div className="first-item">
            <FirstButton history={this.props.history} user={this.props.user} isNewTeacher={this.state.isNewTeacher} />
            {this.renderSecondButton()}
            {this.renderThirdButton()}
          </div>
          {this.props.user.subscriptionState == 0 ?
          <div className="second-item" onClick={() => this.props.history.push(map.ChoosePlan)}>
            Go Premium <SpriteIcon name="hero-sparkle" />
          </div> : <div className="second-item" />
          }
        </div>
        {(this.state.isTeacher || this.state.isAdmin) ?
          <div className="second-col">
            <div>
              {this.renderRightButton()}
              {this.renderRightBottomButton()}
            </div>
          </div>
          : <div className="second-col">
            {this.renderRightButton()}
          </div>
        }
        <MainPageMenu
          user={this.props.user}
          history={this.props.history}
          notificationExpanded={this.state.notificationExpanded}
          toggleNotification={() => this.setState({ notificationExpanded: !this.state.notificationExpanded })}
        />
        <TermsLink history={this.props.history}/>
        <Steps
          enabled={this.state.stepsEnabled}
          steps={this.state.steps}
          initialStep={0}
          onChange={this.onIntroChanged.bind(this)}
          onExit={this.onIntroExit.bind(this)}
          onComplete={() => {}}
        />
        <PolicyDialog isOpen={this.state.isPolicyOpen} close={() => this.setPolicyDialog(false)} />
        <LockedDialog
          label="Play a brick to unlock this feature"
          isOpen={this.state.isMyLibraryOpen}
          close={() => this.setState({ isMyLibraryOpen: false })} />
        <LockedDialog
          label="To unlock this, a brick needs to have been assigned to you"
          isOpen={this.state.isBackToWorkOpen}
          close={() => this.setState({ isBackToWorkOpen: false })} />
        <LockedDialog
          label="Play a brick to unlock this feature"
          isOpen={this.state.isTryBuildOpen}
          close={() => this.setState({ isTryBuildOpen: false })} />
        <ReportsAlertDialog
          isOpen={this.state.isReportLocked}
          close={() => this.setState({ isReportLocked: false })} />
        <InvalidDialog 
          isOpen={this.state.isDesktopOpen} 
          label="This feature is not available on this device, try a desktop browser."
          close={() => this.setState({isDesktopOpen: false})} />
        <ClassInvitationDialog />
        <ClassTInvitationDialog />
      </Grid>
      </React.Suspense>
    );
  }
}

export default connector(MainPageDesktop);
