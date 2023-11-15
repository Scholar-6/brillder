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
import { checkAdmin, checkRealInstitution } from "components/services/brickService";

import WelcomeComponent from './WelcomeComponent';
import MainPageMenu from "components/baseComponents/pageHeader/MainPageMenu";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog";
import TermsLink from "components/baseComponents/TermsLink";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getAssignmentsCount } from "services/axios/brick";
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
import SubscribedDialog from "./components/SubscibedDialog";
import getMainPageSteps from "./MainPageSteps";
import { GetOrigin } from "localStorage/origin";
import PersonalBrickInvitationDialog from "components/baseComponents/classInvitationDialog/PersonalBrickInvitationDialog";



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
  isInstitution: boolean;
  isRealInstitution: boolean;
  isStudent: boolean;
  isBuilder: boolean;

  isNewTeacher: boolean;
  isLibraryOrigin: boolean;

  assignedCount: number;

  // for students
  backWorkActive: boolean;
  isMyLibraryOpen: boolean;
  isBackToWorkOpen: boolean;
  isTryBuildOpen: boolean;
  isReportLocked: boolean;

  // for mobile popopup
  isDesktopOpen: boolean;

  // intro
  stepsEnabled: boolean;
  steps: any[];

  allLoaded: boolean;

  subscribedPopup: boolean;
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

    let isLibraryOrigin = false;
    if (GetOrigin() === 'library') {
      isLibraryOrigin = true;
    }

    let isNewStudent = false;
    if (values.newStudent) {
      isNewStudent = true;
    }


    let subscribedPopup = false;
    if (values.subscribedPopup) {
      subscribedPopup = true;
    }

    const isStudent = isStudentPreference(props.user);
    const isBuilder = isBuilderPreference(props.user);

    this.state = {
      allLoaded: false,
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
      isLibraryOrigin,

      subscribedPopup,

      isTeacher: isTeacherPreference(props.user) || isInstitutionPreference(props.user),
      isAdmin: checkAdmin(props.user.roles),
      isRealInstitution: checkRealInstitution(props.user.roles),
      isStudent,
      isBuilder,
      isInstitution: isInstitutionPreference(props.user),

      assignedCount: 0,

      isDesktopOpen: false,
      stepsEnabled: false,
      steps: getMainPageSteps(isNewStudent, isNewTeacher, isLibraryOrigin, this.props.user.library)
    } as any;

    if (isStudent) {
      this.preparationForStudent();
    }
    setTimeout(() => {
      this.setState({
        allLoaded: true,
        stepsEnabled: isNewTeacher || isNewStudent || isLibraryOrigin
      });
    }, 300);
  }

  async preparationForStudent() {
    let count = await getAssignmentsCount();
    if (count && count > 0) {
      this.setState({ backWorkActive: true, assignedCount: count });
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
      <div className={`create-item-container build-button-d71 ${isActive ? '' : 'disabled'}`} onClick={() => {
        if (disabled) {
          if (isMobile) {
            this.setState({ isDesktopOpen: true });
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
              <div className="m-red-circle bold">
                <DynamicFont content={this.state.assignedCount.toString()} />
              </div>}
          </span>
        </button>
      </div>
    );
  }

  renderSecondButton() {
    if (this.state.isTeacher || this.state.isAdmin) {
      return <TeachButton history={this.props.history} onMobileClick={() => this.setState({ isDesktopOpen: true })} />
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

  renderStatisticButton(disabled?: boolean) {
    let isActive = true;
    if (disabled) {
      isActive = false;
    }
    if (isIPad13 || isTablet) {
      isActive = false;
      disabled = true;
    }

    return (
      <div className={`create-item-container build-button-d71 ${isActive ? '' : 'disabled'}`} onClick={() => {
        if (disabled) {
          if (isMobile) {
            this.setState({ isDesktopOpen: true });
          }
          return;
        }
        this.props.history.push(map.AdminBricksPlayed);
      }}>
        <button className="btn btn-transparent zoom-item svgOnHover">
          <SpriteIcon name="admin-data-g" className={isActive ? 'active text-theme-orange' : 'text-theme-light-blue'} />
          <span className="item-description">Data Dashboard</span>
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
    let className = "create-item-container build-button-d71";
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
            this.setState({ isDesktopOpen: true });
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
      return ""
    }
    let isActive = this.props.user.hasPlayedBrick;
    if (this.state.isTeacher) {
      return this.renderLiveAssignmentButton(true);
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

  renderCompetitionArena() {
    return (
      <div className="create-item-container competition-arena-d54n">
        <button className="btn btn-transparent zoom-item text-theme-orange active"
          onClick={() => {
            window.location.href = "https://brillder.com/brilliant-minds-prizes/";
          }}
        >
          <SpriteIcon name="star" />
          <span className="item-description ">Competition Arena</span>
        </button>
      </div>
    )
  }

  onIntroExit() {
    this.setState({ stepsEnabled: false });
  }

  onIntroChange(e: number) {
    console.log(e, this.state.steps.length);
    if (e >= this.state.steps.length - 1) {
      if (this.state.isNewTeacher) {
        this.props.history.push(map.ViewAllPageB + '&newTeacher=true');
        this.setState({ stepsEnabled: false });
      } else {
        this.props.history.push(map.ViewAllPageB);
        this.setState({ stepsEnabled: false });
      }
    }
  }

  renderBottomMidle() {
    const {user} = this.props;
    let renderPremiumButton = false;
    if (user.subscriptionState === 0 || !user.subscriptionState) {
      renderPremiumButton = true;
      if (user.library) {
        renderPremiumButton = false;
      }
    }

    if (user.isFromInstitution) {
      renderPremiumButton = false;
    }

    if (renderPremiumButton === true) {
      return (
        <div className="second-item" onClick={() => this.props.history.push(map.ChoosePlan)}>
          Subscribe <SpriteIcon name="hero-sparkle" />
        </div>
      );
    }
    return <div className="second-item not-active light-blue" />
  }

  renderAdminBtns() {
    return (
      <div className="first-item">
        <div>
          <FirstButton history={this.props.history} user={this.props.user} isNewTeacher={this.state.isNewTeacher} />
          {this.renderTryBuildButton(true)}
        </div>
        <div>
          {this.renderSecondButton()}
          {this.renderAssignmentsButton()}
        </div>
        <div>
          {this.renderLibraryButton()}
          {this.renderStatisticButton()}
        </div>
      </div>
    );
  }

  renderInstitutionBtns() {
    return (
      <div className="first-item">
        <div>
          <FirstButton history={this.props.history} user={this.props.user} isNewTeacher={this.state.isNewTeacher} />
          {this.renderTryBuildButton(true)}
        </div>
        <div>
          {this.renderSecondButton()}
          {this.renderRightButton()}
        </div>
        <div className="one-btn">
          {this.renderStatisticButton()}
        </div>
      </div>
    );
  }

  renderLearnerBtns() {
    return (
      <div className="first-item">
        <div>
          <FirstButton history={this.props.history} user={this.props.user} isNewTeacher={this.state.isNewTeacher} />
          {this.renderCompetitionArena()}
        </div>
        <div>
          {this.renderAssignmentsButton()}
          {this.renderThirdButton()}
        </div>
      </div>
    );
  }

  renderLibraryLearnerBtns() {
    return (
      <div className="first-item">
        <div>
          <FirstButton history={this.props.history} user={this.props.user} isNewTeacher={this.state.isNewTeacher} />
          {this.renderRightButton()}
        </div>
        <div>
          {this.renderAssignmentsButton()}
          {this.renderThirdButton()}
        </div>
      </div>
    );
  }

  renderEducatorBtns() {
    return (
      <div className="first-item">
        <div>
          <FirstButton history={this.props.history} user={this.props.user} isNewTeacher={this.state.isNewTeacher} />
          {this.renderCreateButton()}
        </div>
        <div>
          {this.renderSecondButton()}
          {this.renderRightButton()}
        </div>
        <div>
          {this.renderLibraryButton()}
        </div>
      </div>
    );
  }

  renderBuilderBtns() {
    return (
      <div className="first-item">
        <div>
          <FirstButton history={this.props.history} user={this.props.user} isNewTeacher={this.state.isNewTeacher} />
          {this.renderCreateButton()}
        </div>
        <div className="one-btn">
          {this.renderThirdButton()}
        </div>
      </div>
    );
  }

  renderBtns() {
    if (this.state.isAdmin) {
      return this.renderAdminBtns();
    } else if (this.state.isRealInstitution) {
      return this.renderInstitutionBtns();
    } else if (this.state.isStudent) {
      if (this.props.user.library) {
        return this.renderLibraryLearnerBtns();
      } else {
        return this.renderLearnerBtns();
      }
    } else if (this.state.isTeacher || this.state.isInstitution) {
      return this.renderEducatorBtns()
    } else if (this.state.isBuilder) {
      return this.renderBuilderBtns()
    }
    return this.renderLearnerBtns();
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        {isTablet ? <TabletTheme /> : <DesktopTheme />}
        <Grid container direction="row" className="mainPage">
          <div className="space-before-first-col" />
          <div className="first-col">
            {this.renderBtns()}
            {this.renderBottomMidle()}
          </div>
          <div className="welcome-col">
            <WelcomeComponent
              user={this.props.user}
              history={this.props.history}
              notifications={this.props.notifications}
              notificationClicked={() => this.setState({ notificationExpanded: !this.state.notificationExpanded })}
            />
          </div>
          <MainPageMenu
            user={this.props.user}
            history={this.props.history}
            notificationExpanded={this.state.notificationExpanded}
            toggleNotification={() => this.setState({ notificationExpanded: !this.state.notificationExpanded })}
          />
          <TermsLink history={this.props.history} />
          <Steps
            enabled={this.state.stepsEnabled}
            steps={this.state.steps}
            initialStep={0}
            // Called before exiting intro
            onExit={this.onIntroExit.bind(this)}
            onChange={this.onIntroChange.bind(this)}
            options={{
              nextLabel: 'Next',
              doneLabel: 'Start Exploring!'
            }}
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
            close={() => this.setState({ isDesktopOpen: false })} />
          {this.state.allLoaded && !this.state.stepsEnabled && <ClassInvitationDialog />}
          {this.state.allLoaded && !this.state.stepsEnabled && <ClassTInvitationDialog />}
          {this.state.allLoaded && !this.state.stepsEnabled && <PersonalBrickInvitationDialog />}
          <SubscribedDialog isOpen={this.state.subscribedPopup} close={() => this.setState({ subscribedPopup: false })} />
        </Grid>
      </React.Suspense>
    );
  }
}

export default connector(MainPageDesktop);
