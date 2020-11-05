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
import { checkAdmin } from "components/services/brickService";

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
  isAdmin: boolean;
  isStudent: boolean;
  isBuilder: boolean;

  // for students
  backWorkActive: boolean;
  isMyLibraryOpen: boolean;
  isBackToWorkOpen: boolean;
  isTryBuildOpen: boolean;

  // for builder
  isBuilderActive: boolean;
  isBuilderBackWorkOpen: boolean;

  // for mobile popopup
  isDesktopOpen: boolean;
  secondaryLabel: string;
  secondPart: string;
}

class MainPage extends Component<MainPageProps, MainPageState> {
  constructor(props: MainPageProps) {
    super(props);

    const {rolePreference} = props.user;

    const isStudent = rolePreference?.roleId === UserType.Student;
    const isBuilder = rolePreference?.roleId === UserType.Builder;

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

      isTeacher: rolePreference?.roleId === UserType.Teacher,
      isAdmin: checkAdmin(props.user.roles),
      isStudent,
      isBuilder,

      isDesktopOpen: false,
      secondaryLabel: '',
      secondPart: ' not yet been optimised for mobile devices.'
    } as any;

    if (isStudent) {
      this.preparationForStudent();
    } else if (isBuilder) {
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
      this.setState({
        isDesktopOpen: true,
        secondaryLabel: 'Building has' + this.state.secondPart
      });
      return;
    }
    clearProposal();
    this.props.forgetBrick();
    this.props.history.push(map.ProposalSubject);
  }

  renderCreateButton() {
    let isActive = true;
    if (isMobile) {
      isActive = false;
    }
    return (
      <div className="create-item-container" onClick={() => this.creatingBrick()}>
        <button className="btn btn-transparent zoom-item svgOnHover">
          <SpriteIcon name="trowel-home" className={isActive ? 'active text-theme-orange' : 'text-theme-light-blue'} />
          <span className="item-description">Start Building</span>
        </button>
      </div>
    );
  }

  renderLibraryButton() {
    let isActive = this.props.user.hasPlayedBrick;
    return (
      <div className="back-item-container my-library" onClick={() => {
        if (isMobile) {
          this.setState({
            isDesktopOpen: true,
            secondaryLabel: 'Your Library has' + this.state.secondPart
          });
          return;
        }
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

  renderStudentWorkButton(isMobile: boolean = false) {
    let isActive = this.state.backWorkActive;
    let disabledColor = 'text-theme-dark-blue';
    if (isMobile) {
      disabledColor = 'text-theme-light-blue';
    }
    return (
      <div className="back-item-container student-back-work" onClick={() => {
        if (isActive) {
          this.props.history.push("/back-to-work");
        } else {
          this.setState({isBackToWorkOpen: true});
        }
      }}>
        <button className={`btn btn-transparent ${isActive ? 'active zoom-item text-theme-orange' : disabledColor}`}>
          <SpriteIcon name="student-back-to-work"/>
          <span className={`item-description ${isActive ? '' : 'disabled'}`}>Back To Work</span>
        </button>
      </div>
    );
  }

  renderSecondButton() {
    if (this.state.isTeacher || this.state.isAdmin) {
      return <TeachButton history={this.props.history} />
    } else if (this.state.isStudent) {
      return this.renderStudentWorkButton();
    }
    return this.renderCreateButton();
  }

  renderThirdButton() {
    if (this.state.isTeacher) {
      return this.renderTryBuildButton(true);
    } else if (this.state.isStudent) {
      return this.renderLibraryButton();
    }
    return this.renderWorkButton();
  }

  renderWorkButton(isMobile: boolean = false) {
    let isAdmin = checkAdmin(this.props.user.roles);
    let isActive = isAdmin || this.state.isBuilderActive;

    let disabledColor = 'text-theme-dark-blue';
    if (isMobile) {
      disabledColor = 'text-theme-light-blue';
    }

    return (
      <div className="back-item-container" onClick={() => {
        if (isActive) {
          this.props.history.push("/back-to-work");
        } else {
          this.setState({isBuilderBackWorkOpen: true});
        }
      }}>
        <button className={`btn btn-transparent ${isActive ? 'text-theme-orange zoom-item' : disabledColor}`}>
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
      <div className="back-item-container student-back-work" onClick={() => {
        if (isMobile) {
          this.setState({
            isDesktopOpen: true,
            secondaryLabel: 'Reports have ' + this.state.secondPart
          });
        }
      }}>
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
    if (this.state.isBuilder) {
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
    let isActive = this.props.user.hasPlayedBrick;
    if (this.state.isTeacher) {
      return this.renderLiveAssignmentButton(false);
    } else if (this.state.isStudent) {
      return this.renderTryBuildButton(isActive);
    } else if (this.state.isAdmin) {
      return this.renderCreateButton();
    }
    return "";
  }

  renderRightBottomButton() {
    if (this.state.isTeacher) {
      return this.renderReportsButton(false);
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
    const {user} = this.props;
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
            <SwiperSlide><FirstButton user={user} history={this.props.history} /></SwiperSlide>
            {(this.state.isBuilder || this.state.isAdmin) && <SwiperSlide>{this.renderCreateButton()}</SwiperSlide>}
            {(this.state.isBuilder || this.state.isTeacher || this.state.isAdmin) && <SwiperSlide>{this.renderWorkButton(true)}</SwiperSlide>}
            {(this.state.isTeacher || this.state.isAdmin) && <SwiperSlide><TeachButton history={this.props.history} /></SwiperSlide>}
            {(this.state.isTeacher || this.state.isAdmin) && <SwiperSlide>{this.renderReportsButton(false)}</SwiperSlide>}
            {(this.state.isTeacher || this.state.isAdmin) && <SwiperSlide>{this.renderLiveAssignmentButton(false)}</SwiperSlide>}
            {(this.state.isStudent || this.state.isTeacher) && <SwiperSlide>{this.renderTryBuildButton(user.hasPlayedBrick)}</SwiperSlide>}
            {this.state.isStudent && <SwiperSlide>{this.renderLibraryButton()}</SwiperSlide>}
            {this.state.isStudent && <SwiperSlide>{this.renderStudentWorkButton(true)}</SwiperSlide>}
          </Swiper>
          <button className="btn btn-transparent next-image svgOnHover" onClick={() => this.swipeNext()}>
            <SpriteIcon name="arrow-down" className="w100 h100 active text-white" />
          </button>
        </div>
        <MainPageMenu
          user={user}
          history={this.props.history}
          notificationExpanded={this.state.notificationExpanded}
          toggleNotification={() => this.setState({ notificationExpanded: !this.state.notificationExpanded })}
        />
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
        {this.state.isTeacher ?
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
        <DesktopVersionDialogV2
          isOpen={this.state.isDesktopOpen} secondaryLabel={this.state.secondaryLabel}
          onClick={() => this.setState({isDesktopOpen: false})}
        />
      </Grid>
    );
  }
}

export default connector(MainPage);
