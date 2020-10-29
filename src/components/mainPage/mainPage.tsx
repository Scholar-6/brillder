import React, { Component } from "react";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Hidden } from "@material-ui/core";
import 'swiper/swiper.scss';

import "./mainPage.scss";
import actions from "redux/actions/auth";
import brickActions from "redux/actions/brickActions";
import { User, UserType } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { clearProposal } from "localStorage/proposal";
import map from 'components/map';
import { Notification } from 'model/notifications';
import { checkAdmin, checkTeacherOrAdmin } from "components/services/brickService";

import WelcomeComponent from './WelcomeComponent';
import MainPageMenu from "components/baseComponents/pageHeader/MainPageMenu";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getAssignedBricks, getCurrentUserBricks } from "services/axios/brick";
import LockedDialog from "components/baseComponents/dialogs/LockedDialog";
import TeachButton from "./TeachButton";
import FirstButton from "./FirstButton";
import DesktopVersionDialogV2 from "components/build/baseComponents/dialogs/DesktopVersionDialogV2";
import { isMobile } from "react-device-detect";


const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  logout: () => dispatch(actions.logout()),
});

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
  swiper: any;
  isPolicyOpen: boolean;
  notificationExpanded: boolean;
  isTeacher: boolean;

  // for students
  backWorkActive: boolean;
  isMyLibraryOpen: boolean;
  isBackToWorkOpen: boolean;
  isTryBuildOpen: boolean;

  // for builder
  isBuilderActive: boolean;
  isBuilderBackWorkOpen: boolean;

  // for mobile
  isDesktopOpen: boolean;
}

class MainPage extends Component<MainPageProps, MainPageState> {
  constructor(props: MainPageProps) {
    super(props);

    this.state = {
      createHober: false,
      backHober: false,
      swiper: null,
      isPolicyOpen: false,
      notificationExpanded: false,
      backWorkActive: false,
      isMyLibraryOpen: false,
      isBackToWorkOpen: false,
      isTryBuildOpen: false,
      isBuilderActive: false,
      isBuilderBackWorkOpen: false,
      isDesktopOpen: false,
      isTeacher: checkTeacherOrAdmin(props.user.roles)
    } as any;

    const {rolePreference} = props.user;
    if (rolePreference?.roleId === UserType.Student) {
      this.preparationForStudent();
    } else if (rolePreference?.roleId === UserType.Builder) {
      this.preparationForBuilder();
    }
  }

  async preparationForStudent() {
    let bricks = await getAssignedBricks();
    if (bricks && bricks.length > 0) {
      this.setState({backWorkActive: true});
    }
  }

  async preparationForBuilder() {
    let bricks = await getCurrentUserBricks();
    if (bricks && bricks.length > 0) {
      this.setState({isBuilderActive: true });
    }
  }

  setPolicyDialog(isPolicyOpen: boolean) {
    this.setState({ isPolicyOpen });
  }

  creatingBrick() {
    if (isMobile) {
      this.setState({isDesktopOpen: true});
      return;
    }
    clearProposal();
    this.props.forgetBrick();
    this.props.history.push(map.ProposalSubject);
  }

  renderCreateButton() {
    return (
      <div className="create-item-container" onClick={() => this.creatingBrick()}>
        <button className="btn btn-transparent zoom-item svgOnHover">
          <SpriteIcon name="trowel-home" className="active text-theme-orange" />
          <span className="item-description">Start Building</span>
        </button>
      </div>
    );
  }

  renderLibraryButton() {
    let isActive = this.props.user.hasPlayedBrick;
    return (
      <div className="back-item-container my-library" onClick={() => {
        if (isActive) { 
          this.props.history.push('/my-library');
        } else {
          this.setState({isMyLibraryOpen: true});
        }
      }}>
        <button className={`btn btn-transparent ${isActive ? 'active zoom-item text-theme-orange svgOnHover' : 'text-theme-dark-blue'}`}>
          <SpriteIcon name="library-book" className="active" />
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>My Library</span>
        </button>
      </div>
    );
  }

  renderStudentWorkButton() {
    let isActive = this.state.backWorkActive;
    return (
      <div className="back-item-container student-back-work" onClick={() => {
        if (isActive) {
          this.props.history.push("/back-to-work");
        } else {
          this.setState({isBackToWorkOpen: true});
        }
      }}>
        <button className={`btn btn-transparent ${isActive ? 'active zoom-item text-theme-orange' : 'text-theme-dark-blue'}`}>
          <SpriteIcon name="student-back-to-work"/>
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>Back To Work</span>
        </button>
      </div>
    );
  }

  renderSecondButton() {
    const { rolePreference } = this.props.user;
    if (rolePreference) {
      const {roleId} = rolePreference;
      if (roleId === UserType.Teacher) {
        return <TeachButton history={this.props.history} />
      } else if (roleId === UserType.Student) {
        return this.renderStudentWorkButton();
      }
    }
    return this.renderCreateButton();
  }

  renderThirdButton() {
    const { rolePreference } = this.props.user;
    if (rolePreference) {
      const {roleId} = rolePreference;
      if (roleId === UserType.Teacher) {
        return this.renderTryBuildButton(true);
      } else if (roleId === UserType.Student) {
        return this.renderLibraryButton();
      }
    }
    return this.renderWorkButton();
  }

  renderWorkButton() {
    let isAdmin = checkAdmin(this.props.user.roles);
    let isActive = isAdmin || this.state.isBuilderActive;

    return (
      <div className="back-item-container" onClick={() => {
        if (isActive) {
          this.props.history.push("/back-to-work");
        } else {
          this.setState({isBuilderBackWorkOpen: true});
        }
      }}>
        <button className={`btn btn-transparent ${isActive ? 'text-theme-orange zoom-item' : 'text-theme-dark-blue'}`}>
          <SpriteIcon name="student-back-to-work" />
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>Back To Work</span>
        </button>
      </div>
    );
  }

  renderLiveAssignmentButton(isActive: boolean) {
    return (
      <div className="back-item-container student-back-work" onClick={() => {}}>
        <button className={`btn btn-transparent ${isActive ? 'active zoom-item text-theme-orange' : 'text-theme-light-blue'}`}>
          <SpriteIcon name="student-back-to-work"/>
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>Live Assignments</span>
        </button>
      </div>
    );
  }

  renderReportsButton(isActive: boolean) {
    return (
      <div className="back-item-container student-back-work" onClick={() => {}}>
        <button className={`btn btn-transparent ${isActive ? 'active zoom-item text-theme-orange' : 'text-theme-light-blue'}`}>
          <SpriteIcon name="book-open"/>
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>Reports</span>
        </button>
      </div>
    );
  }

  renderTryBuildButton(isActive: boolean) {
    return (
      <div className="create-item-container" onClick={() => {
        if (isActive) {
          this.creatingBrick()
        } else {
          this.setState({isTryBuildOpen: true});
        }
      }}>
        <button className={`btn btn-transparent ${isActive ? 'zoom-item text-theme-orange active' : 'text-theme-light-blue'}`}>
          <SpriteIcon name="trowel-home" />
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>Try building?</span>
        </button>
      </div>
    );
  }

  renderRightButton() {
    if (this.props.user.rolePreference?.roleId === UserType.Builder) {
      let isActive = false;
      return (
        <div className="create-item-container">
          <button className={`btn btn-transparent ${isActive ? 'zoom-item text-theme-orange active' : 'text-theme-light-blue'}`}>
            <SpriteIcon name="book-open" />
            <span className={`item-description ${isActive ? '' : 'disabled'}`}>Brick Stats</span>
          </button>
        </div>
      );
    }
    const { rolePreference } = this.props.user;
    let isActive = this.props.user.hasPlayedBrick;
    if (rolePreference) {
      const {roleId} = rolePreference;
      if (roleId === UserType.Teacher) {
        return this.renderLiveAssignmentButton(false);
      } else if (roleId === UserType.Student) {
        return this.renderTryBuildButton(isActive);
      }
    }
    if (this.state.isTeacher) {
      return <TeachButton history={this.props.history} />
    }
    return "";
  }

  renderRightBottomButton() {
    const { rolePreference } = this.props.user;
    if (rolePreference) {
      const {roleId} = rolePreference;
      if (roleId === UserType.Teacher) {
        return this.renderReportsButton(false);
      }
    }
    return "";
  }

  swipeNext() {
    if (this.state.swiper) {
      this.state.swiper.slideNext();
    }
  }

  swipePrev() {
    if (this.state.swiper) {
      this.state.swiper.slidePrev();
    }
  }

  renderMobilePage() {
    return (
      <Hidden only={["sm", "md", "lg", "xl"]}>
        <div className="mobile-main-page">
          <button className="btn btn-transparent prev-image svgOnHover" onClick={() => this.swipePrev()}>
            <SpriteIcon name="arrow-up" className="w100 h100 active text-white" />
          </button>
          <Swiper
            slidesPerView={3}
            loop={true}
            loopedSlides={20}
            direction="vertical"
            onSwiper={swiper => {
              this.setState({ ...this.state, swiper });
            }}
          >
            <SwiperSlide>
              <FirstButton user={this.props.user} history={this.props.history} />
            </SwiperSlide>
            <SwiperSlide>{this.renderCreateButton()}</SwiperSlide>
            <SwiperSlide>{this.renderWorkButton()}</SwiperSlide>
          </Swiper>
          <button className="btn btn-transparent next-image svgOnHover" onClick={() => this.swipeNext()}>
            <SpriteIcon name="arrow-down" className="w100 h100 active text-white" />
          </button>
        </div>
      </Hidden>
    );
  }

  renderDesktopPage() {
    return (
      <Hidden only={["xs"]}>
        <div className="welcome-col">
          <WelcomeComponent
            user={this.props.user}
            notifications={this.props.notifications}
            notificationClicked={() => this.setState({ notificationExpanded: true })}
          />
        </div>
        <div className="first-col">
          <div className="first-item">
            <FirstButton history={this.props.history} user={this.props.user} />
            {this.renderSecondButton()}
            {this.renderThirdButton()}
          </div>
          <div className="second-item"></div>
        </div>
        {this.props.user.rolePreference && this.props.user.rolePreference.roleId === UserType.Teacher ?
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
        <div className="policy-text">
          <span onClick={() => this.setPolicyDialog(true)}>Privacy Policy</span>
        </div>
      </Hidden>
    );
  }

  render() {
    return (
      <Grid container direction="row" className="mainPage">
        {this.renderDesktopPage()}
        {this.renderMobilePage()}
        <PolicyDialog isOpen={this.state.isPolicyOpen} close={() => this.setPolicyDialog(false)} />
        <LockedDialog
          label="Play a brick to unlock this feature"
          isOpen={this.state.isMyLibraryOpen}
          close={() => this.setState({isMyLibraryOpen: false})} />
        <LockedDialog
          label="To unlock this, a brick needs to have been assigned to you"
          isOpen={this.state.isBackToWorkOpen}
          close={() => this.setState({isBackToWorkOpen: false})} />
        <LockedDialog
          label="Play a brick to unlock this feature"
          isOpen={this.state.isTryBuildOpen}
          close={() => this.setState({isTryBuildOpen: false})} />
        <LockedDialog
          label="Start Building to unlock this feature"
          isOpen={this.state.isBuilderBackWorkOpen}
          close={() => this.setState({isBuilderBackWorkOpen: false})} />
        <DesktopVersionDialogV2 isOpen={this.state.isDesktopOpen} onClick={() => this.setState({isDesktopOpen: false})} />
      </Grid>
    );
  }
}

export default connector(MainPage);
