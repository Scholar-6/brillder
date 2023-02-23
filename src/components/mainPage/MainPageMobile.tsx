import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { Grid } from "@material-ui/core";
import DynamicFont from "react-dynamic-font";
// @ts-ignore
import { Steps } from 'intro.js-react';

import "./themes/MainPageMobile.scss";
import actions from "redux/actions/auth";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import map from "components/map";
import { Notification } from "model/notifications";

import MainPageMenu from "components/baseComponents/pageHeader/MainPageMenu";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import LockedDialog from "components/baseComponents/dialogs/LockedDialog";
import TeachButton from "./components/TeachButton";
import FirstButton from "./components/FirstButton";
import DesktopVersionDialogV2 from "components/build/baseComponents/dialogs/DesktopVersionDialogV2";
import MobileButtonWrap from "./MobileButtonWrap";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import LibraryButton from "./components/LibraryButton";
import { getAssignedBricks } from "services/axios/brick";
import { isBuilderPreference, isInstitutionPreference, isStudentPreference, isTeacherPreference } from "components/services/preferenceService";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";
import SubscribedDialog from "./components/SubscibedDialog";
import PersonalBrickInvitationDialog from "components/baseComponents/classInvitationDialog/PersonalBrickInvitationDialog";
import { checkAdmin } from "components/services/brickService";
import FirstPhoneButton from "./components/FirstPhoneButton";
import { fileUrl } from "components/services/uploadFile";
import ReactiveUserCredits from "components/userProfilePage/ReactiveUserCredits";

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications,
});

const mapDispatch = (dispatch: any) => ({
  logout: () => dispatch(actions.logout()),
});

const connector = connect(mapState, mapDispatch);

interface MainPageProps {
  history: any;
  user: User;
  notifications: Notification[] | null;
  logout(): void;
}

interface MainPageState {
  notificationExpanded: boolean;

  isNewStudent: boolean;

  // for students
  isMyLibraryOpen: boolean;
  isBackToWorkOpen: boolean;
  isTryBuildOpen: boolean;

  isStudent: boolean;
  isAdmin: boolean;
  isEducator: boolean;
  isInstitution: boolean;
  isBuilder: boolean;

  assignedCount: number;

  // for mobile popopup
  isDesktopOpen: boolean;
  secondaryLabel: string;
  secondPart: string;

  notificationText: string;

  subscribedPopup: boolean;
  steps: any[];
}

class MainPage extends Component<MainPageProps, MainPageState> {
  constructor(props: MainPageProps) {
    super(props);

    // onboarding users logic
    let isNewStudent = false;
    const values = queryString.parse(this.props.history.location.search);
    if (values.newStudent) {
      isNewStudent = true;
    }

    let subscribedPopup = false;
    if (values.subscribedPopup) {
      subscribedPopup = true;
    }

    const notificationText = this.getNotificationsText(props.notifications);

    this.state = {
      notificationExpanded: false,
      isMyLibraryOpen: false,
      isBackToWorkOpen: false,
      isTryBuildOpen: false,
      isNewStudent,

      notificationText,

      subscribedPopup,

      isAdmin: checkAdmin(props.user.roles),
      isTeacher: isTeacherPreference(props.user),
      isStudent: isStudentPreference(props.user),
      isBuilder: isBuilderPreference(props.user),
      isInstitution: isInstitutionPreference(props.user),

      assignedCount: 0,

      isDesktopOpen: false,
      secondaryLabel: "",
      secondPart: " not yet been optimised for mobile devices.",
      steps: this.prepareSteps()
    } as any;

    this.preparationForStudent();
  }

  getNotificationsText(notifications: Notification[] | null) {
    if (notifications && notifications.length >= 1) {
      let welcomeText = `You have <span class="bold">${notifications.length}</span>`;
      if (notifications.length === 1) {
        welcomeText += ' new notification';
      } else {
        welcomeText += ' new notifications';
      }
      return welcomeText;
    }
    return 'You have no new notifications';
  }

  prepareSteps() {
    let steps = [] as any[];

    steps.push({
      element: '.view-item-container',
      intro: `<div class="ggf-new-student-popup">
        <p class="bold">Welcome to brillder!</p>
        <p>Explore our catalogue of ‘bricks’ by clicking <span class="bold">View & Play</span></p>
      </div>
      `,
    });

    steps.push({
      element: '.back-item-container',
      intro: `<p>Find and Play your assigned ‘bricks’ here</p>`,
    });

    if (!this.props.user.library) {
      steps.push({
        element: '.competition-item-container',
        intro: `<p>Discover our daily competitions here - play to win brills, which can be converted to real cash over time!</p>`,
      });
    }

    steps.push({
      element: '.zendesk-position',
      intro: `<p>If you spot anything that doesn't look right, or experience a technical issue, click here to create a help ticket</p>`
    });

    if (!this.props.user.library) {
      steps.push({
        element: '.desktop-credit-coins',
        intro: `
        <p>
          You need to spend credits to play bricks. Spend 1 credit to play a brick from the catalogue or 2 credits to enter a competition.
          We've given you 5 free credits to get you started!
        </p>
      `
      });
    }

    steps.push({
      element: '.brill-coin-img',
      intro: `<p>The more “bricks” you play, and the better you do, the more “brills” you can earn. As a library user, if you earn enough you'll become one of our Brilliant Minds! We've given you 200 as a welcome gift!</p>`
    });

    return steps;
  }

  async preparationForStudent() {
    let bricks = await getAssignedBricks();
    if (bricks && bricks.length > 0) {
      this.setState({ assignedCount: bricks.length });
    }
  }

  renderCreateButton() {
    return (
      <div
        className="create-item-container"
        onClick={() => {
          this.setState({
            isDesktopOpen: true,
            secondaryLabel: "",
          });
        }}
      >
        <button className="btn btn-transparent zoom-item">
          <SpriteIcon name="trowel-home" className="text-theme-light-blue" />
          <span className="item-description">Build Bricks</span>
        </button>
      </div>
    );
  }

  renderCompetitionButton() {
    return (
      <div
        className="competition-item-container"
        onClick={() => {
          window.location.href = "https://brillder.com/brilliant-minds-prizes/";
        }}
      >
        <button className="btn btn-transparent zoom-item">
          <SpriteIcon name="star" className="text-theme-orange" />
          <span className="item-description">Competition Arena</span>
        </button>
      </div>
    );
  }

  renderLibraryButton() {
    const isActive = this.props.user.hasPlayedBrick;
    return (
      <LibraryButton
        isActive={isActive}
        history={this.props.history}
        onClick={() => this.setState({ isMyLibraryOpen: true })}
      />
    );
  }

  renderAssignmentsButton() {
    return (
      <div
        className="assignments-btn"
        onClick={() => {
          if (this.state.assignedCount > 0) {
            this.props.history.push(map.AssignmentsPage);
          } else {
            this.setState({ isBackToWorkOpen: true });
          }
        }}
      >
        <div className="flex-center">
          <SpriteIcon name="assignments-icon" className={`${this.state.assignedCount === 0 ? 'disabled' : ''}`} />
        </div>
        <div className="flex-center">
          <span className="item-description">
            {this.state.isAdmin ? "Assignments" : this.state.isEducator ? "Shared with Me" : "My Assignments"}
          </span>
        </div>
      </div>
    );
  }

  firstButton() {
    return (
      <div className="view-and-play-btn">
        <div className="flex-center">
          <SpriteIcon name="glasses-v2" className="active text-theme-orange" />
        </div>
        <div className="flex-center">
          <span className="item-description">View & Play</span>
        </div>
      </div>
    );
  }

  onIntroExit() {
    this.setState({ isNewStudent: false });
  }

  renderMobilePage() {
    if (this.state.isBuilder || this.state.isInstitution) {
      return (
        <Grid
          container
          item
          className="mobile-main-buttons"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={6} className="btn-center-v4">
            {this.firstButton()}
          </Grid>
          <Grid item xs={6} className="btn-center-v4">
            {this.renderLibraryButton()}
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid
        container
        item
        className="mobile-main-buttons"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={6} className="btn-center-v4">
          {this.firstButton()}
        </Grid>
        <Grid item xs={6} className="btn-center-v4">
          {this.renderAssignmentsButton()}
        </Grid>
        <Grid item xs={12} className="btn-center-v4">
          {this.renderLibraryButton()}
        </Grid>
      </Grid>
    );
  }

  renderSparkle() {
    const { user } = this.props;
    if (user && user.subscriptionState && user.subscriptionState > 0) {
      return <SpriteIcon className="sparkle-s6" name="hero-sparkle" />;
    }
    return '';
  }

  render() {
    return (
      <Grid container direction="row" className="mainPageMobile">
        <div className="mobile-main-page">
          <div className="absolute-brills-and-coins">
            <div className="brill-coin-container">
              <div className="brills-count">
                {this.props.user.brills}
              </div>
              <div className="brill-coin-img">
                <img alt="brill" className="brills-icon" src="/images/Brill.svg" />
                <SpriteIcon name="logo" />
                <div className="css-custom-tooltip ">
                  <div className="bold">What are brills?</div>
                  <div className="regular">If you score over 50% on your first attempt or improve an earlier score while scoring over 50%, your percentage converts into bonus points, called brills. We're giving 200 brills to all new and existing users as a thank you for using our platform.</div>
                  <div className="regular">Collect enough brills and you can even win cash prizes!</div>
                </div>
              </div>
            </div>
          </div>
          <div className="coins-container">
            <ReactiveUserCredits className="phone-credit-coins" history={this.props.history} />
          </div>
          <div className="welcome-container">
            <div>
              <div className="bold welcome-title">Welcome to Brillder,</div>
              <div
                className="welcome-name"
                onClick={() => this.props.history.push(map.UserProfile)}
              >
                <div className="centered">
                  {this.props.user.profileImage
                    ?
                    <div className="profile-image-border">
                      <img alt="user-profile" src={fileUrl(this.props.user.profileImage)} />
                    </div>
                    : <SpriteIcon name="user-custom" />
                  }
                </div>
                <span>{this.props.user.firstName}</span>
                {this.renderSparkle()}
              </div>
              <div dangerouslySetInnerHTML={{ __html: this.state.notificationText }} />
            </div>
          </div>
          {this.renderMobilePage()}
        </div>
        <div className="subscribe-btn" onClick={() => this.props.history.push(map.ChoosePlan)}>
          <div className="bold">Subscribe</div>
          <SpriteIcon name="hero-sparkle" />
        </div>
        <MainPageMenu
          user={this.props.user}
          history={this.props.history}
          notificationExpanded={this.state.notificationExpanded}
          toggleNotification={() =>
            this.setState({
              notificationExpanded: !this.state.notificationExpanded,
            })
          }
        />
        <LockedDialog
          label="Play a brick to unlock this feature"
          isOpen={this.state.isMyLibraryOpen}
          close={() => this.setState({ isMyLibraryOpen: false })}
        />
        <LockedDialog
          label="To unlock this, a brick needs to have been assigned to you"
          isOpen={this.state.isBackToWorkOpen}
          close={() => this.setState({ isBackToWorkOpen: false })}
        />
        <LockedDialog
          label="Play a brick to unlock this feature"
          isOpen={this.state.isTryBuildOpen}
          close={() => this.setState({ isTryBuildOpen: false })}
        />
        <DesktopVersionDialogV2
          isOpen={this.state.isDesktopOpen}
          secondaryLabel={this.state.secondaryLabel}
          onClick={() => this.setState({ isDesktopOpen: false })}
        />
        {!this.state.isNewStudent && <ClassInvitationDialog />}
        {!this.state.isNewStudent && <ClassTInvitationDialog />}
        {!this.state.isNewStudent && <PersonalBrickInvitationDialog />}
        <SubscribedDialog isOpen={this.state.subscribedPopup} close={() => this.setState({ subscribedPopup: false })} />
      </Grid>
    );
  }
}

export default connector(MainPage);
