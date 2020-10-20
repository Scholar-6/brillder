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
import { checkTeacherOrAdmin } from "components/services/brickService";

import WelcomeComponent from './WelcomeComponent';
import MainPageMenu from "components/baseComponents/pageHeader/MainPageMenu";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getAssignedBricks } from "services/axios/brick";
import LockedDialog from "components/baseComponents/dialogs/LockedDialog";
import TeachButton from "./TeachButton";


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
  isBuilderBackWorkOpen: boolean;
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
      isBuilderBackWorkOpen: false,
      isTeacher: checkTeacherOrAdmin(props.user.roles)
    } as any;

    const {rolePreference} = props.user;
    if (rolePreference?.roleId === UserType.Student) {
      this.preparationForStudent();
    }
  }

  async preparationForStudent() {
    let bricks = await getAssignedBricks();
    if (bricks && bricks.length > 0) {
      this.setState({backWorkActive: true});
    }
  }

  setPolicyDialog(isPolicyOpen: boolean) {
    this.setState({ isPolicyOpen });
  }

  creatingBrick() {
    clearProposal();
    this.props.forgetBrick();
    this.props.history.push(map.ProposalSubject);
  }

  renderViewAllLabel() {
    const { rolePreference } = this.props.user;
    if (rolePreference && rolePreference.roleId === UserType.Student) {
      return "View & Play";
    }
    return this.state.isTeacher ? "View & Assign Bricks" : "View All Bricks";
  }

  renderViewAllButton() {
    return (
      <div className="view-item-container zoom-item" onClick={() => this.props.history.push("/play/dashboard")}>
        <div className="eye-glass-icon">
          <div className="svgOnHover">
            <SpriteIcon name="glasses-home" className="active text-theme-orange" />
          </div>
          <div className="glass-eyes-left svgOnHover">
            <svg className="svg active" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path fill="#F5F6F7" className="eyeball" d="M2,12c0,0,3.6-7.3,10-7.3S22,12,22,12s-3.6,7.3-10,7.3S2,12,2,12z" />
              <path fill="#001C55" className="pupil" d="M13.1,12c0,2.1-1.7,3.8-3.8,3.8S5.5,14.1,5.5,12s1.7-3.8,3.8-3.8S13.1,9.9,13.1,12L13.1,12z" />
            </svg>
          </div>
          <div className="glass-eyes-right svgOnHover">
            <svg className="svg active" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path fill="#F5F6F7" className="eyeball" d="M2,12c0,0,3.6-7.3,10-7.3S22,12,22,12s-3.6,7.3-10,7.3S2,12,2,12z" />
              <path fill="#001C55" className="pupil" d="M13.1,12c0,2.1-1.7,3.8-3.8,3.8S5.5,14.1,5.5,12s1.7-3.8,3.8-3.8S13.1,9.9,13.1,12L13.1,12z" />
            </svg>
          </div>
        </div>
        <span className="item-description">{this.renderViewAllLabel()}</span>
      </div>
    );
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
          this.props.history.push(map.BackToWorkLearnTab);
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
    if (rolePreference && rolePreference.roleId === UserType.Student) {
      return this.renderStudentWorkButton();
    }
    return this.renderCreateButton();
  }

  renderThirdButton() {
    const { rolePreference } = this.props.user;
    if (rolePreference && rolePreference.roleId === UserType.Student) {
      return this.renderLibraryButton();
    }
    return this.renderWorkButton();
  }

  renderWorkButton() {
    let isActive = this.props.user.hasPlayedBrick;

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
    if (rolePreference && rolePreference.roleId === UserType.Student) {
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
    if (this.state.isTeacher) {
      return <TeachButton history={this.props.history} />
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
            <SwiperSlide>{this.renderViewAllButton()}</SwiperSlide>
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
            {this.renderViewAllButton()}
            {this.renderSecondButton()}
            {this.renderThirdButton()}
          </div>
          <div className="second-item"></div>
        </div>
        <div className="second-col">
          {this.renderRightButton()}
        </div>
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
      </Grid>
    );
  }
}

export default connector(MainPage);
