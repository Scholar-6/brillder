import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "@material-ui/core";
import "swiper/swiper.scss";
import DynamicFont from "react-dynamic-font";
// @ts-ignore
import { Steps } from 'intro.js-react';

import "./themes/MainPageMobile.scss";
import actions from "redux/actions/auth";
import { RolePreference, User, UserType } from "model/user";
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
import BlocksIcon from "./components/BlocksIcon";
import { getAssignedBricks } from "services/axios/brick";

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
  swiper: any;
  notificationExpanded: boolean;

  isNewStudent: boolean;
  isStudent: boolean;
  isBuilder: boolean;

  // for students
  isMyLibraryOpen: boolean;
  isBackToWorkOpen: boolean;
  isTryBuildOpen: boolean;

  isSwiping: boolean;

  assignedCount: number;

  // for mobile popopup
  isDesktopOpen: boolean;
  secondaryLabel: string;
  secondPart: string;

  steps: any[];
}

class MainPage extends Component<MainPageProps, MainPageState> {
  constructor(props: MainPageProps) {
    super(props);

    const { rolePreference } = props.user;

    const isStudent = rolePreference?.roleId === RolePreference.Student;
    const isBuilder = rolePreference?.roleId === RolePreference.Builder;

    // onboarding users logic
    let isNewStudent = false;
    const values = queryString.parse(this.props.history.location.search);
    if (values.newStudent) {
      isNewStudent = true;
    }

    this.state = {
      swiper: null,
      notificationExpanded: false,
      isMyLibraryOpen: false,
      isBackToWorkOpen: false,
      isTryBuildOpen: false,
      isSwiping: false,
      isNewStudent,

      isStudent,
      isBuilder,

      assignedCount: 0,

      isDesktopOpen: false,
      secondaryLabel: "",
      secondPart: " not yet been optimised for mobile devices.",
      stepsEnabled: isNewStudent,
      steps: [{
        element: '.view-item-container',
        intro: `<div class="ggf-new-student-popup">
          <p class="bold">Welcome to brillder!</p>
          <p>Explore our catalogue of 'bricks' by clicking <span class="bold">View & Play</span></p>
        </div>
        `,
      },{
        element: '.view-item-container',
        intro: `<p>Welcome to brillder!</p>`,
      }]
    } as any;

    this.preparationForStudent();
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
          if (!this.state.isSwiping) {
            this.setState({
              isDesktopOpen: true,
              secondaryLabel: "",
            });
          }
        }}
      >
        <button className="btn btn-transparent zoom-item">
          <SpriteIcon name="trowel-home" className="text-theme-light-blue" />
          <span className="item-description">Build Bricks</span>
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
        className="back-item-container"
        onClick={() => {
          if (!this.state.isSwiping) {
            if (this.state.assignedCount > 0) {
              this.props.history.push(map.AssignmentsPage);
            } else {
              this.setState({isBackToWorkOpen: true});
            }
          }
        }}
      >
        <button className="btn btn-transparent zoom-item">
          <BlocksIcon disabled={this.state.assignedCount === 0} />
          <span className="item-description flex-number">
            {this.props.user.rolePreference?.roleId === UserType.Teacher
              ? "Shared with Me"
              : "My Assignments"}
            {this.state.assignedCount > 0 && (
              <div className="m-red-circle">
                <DynamicFont content={this.state.assignedCount.toString()} />
              </div>
            )}
          </span>
        </button>
      </div>
    );
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

  handleMobileClick(e: any) {
    if (this.state.isSwiping === false) {
      const { height } = window.screen;
      const minY = height / 3;
      const maxY = (height / 3) * 2;

      const finished = () => {
        this.setState({ isSwiping: true });
        setTimeout(() => this.setState({ isSwiping: false }), 200);
      };

      if (e.touches.currentY < minY) {
        this.state.swiper.slidePrev();
        finished();
      } else if (e.touches.currentY > maxY) {
        this.state.swiper.slideNext();
        finished();
      }
    }
  }

  onIntroExit() {
    this.setState({isNewStudent: false});
  }

  onIntroChanged(e: any) {
    if (e !== 0) {
      this.props.history.push(map.ViewAllPage);
      this.setState({isNewStudent: false});
    }
  }

  renderNewStudentPage() {
    return (
      <div className="mobile-main-page new-student">
        <MobileButtonWrap>
          <FirstButton
            user={this.props.user}
            history={this.props.history}
            disabled={this.state.isSwiping}
          />
        </MobileButtonWrap>
        {this.renderAssignmentsButton()}
        <Steps
          enabled={this.state.isNewStudent}
          steps={this.state.steps}
          initialStep={0}
          onChange={this.onIntroChanged.bind(this)}
          onExit={this.onIntroExit.bind(this)}
          onComplete={() => {}}
        />
      </div>
    );
  }

  renderMobilePage() {
    const { user } = this.props;

    const firstButton = (index: number) => {
      return (
        <SwiperSlide key={index}>
          <MobileButtonWrap>
            <FirstButton
              user={user}
              history={this.props.history}
              disabled={this.state.isSwiping}
            />
          </MobileButtonWrap>
        </SwiperSlide>
      );
    };

    const renderStudentButtons = () => {
      const buttons = [];
      buttons.push(firstButton(1));
      buttons.push(<SwiperSlide key={2}>{this.renderAssignmentsButton()}</SwiperSlide>);
      buttons.push(<SwiperSlide key={3}>{this.renderLibraryButton()}</SwiperSlide>);
      buttons.push(<SwiperSlide key={4}>{this.renderCreateButton()}</SwiperSlide>);
      return buttons;
    };

    const renderBuildButtons = () => {
      const buttons = [];
      buttons.push(firstButton(1));
      buttons.push(<SwiperSlide key={2}>{this.renderCreateButton()}</SwiperSlide>);
      buttons.push(<SwiperSlide key={3}>{this.renderAssignmentsButton()}</SwiperSlide>);
      return buttons;
    };

    const renderTeachButtons = () => {
      const buttons = [];
      buttons.push(firstButton(1));
      buttons.push(
        <SwiperSlide key={2}>
          <TeachButton
            history={this.props.history}
            disabled={true}
            onMobileClick={() => {
              if (!this.state.isSwiping) {
                this.setState({
                  isDesktopOpen: true,
                  secondaryLabel: "",
                });
              }
            }}
          />
        </SwiperSlide>
      );
      buttons.push(<SwiperSlide key={3}>{this.renderCreateButton()}</SwiperSlide>);
      buttons.push(<SwiperSlide key={4}>{this.renderAssignmentsButton()}</SwiperSlide>);
      return buttons;
    };

    if (this.state.isNewStudent) {
      return this.renderNewStudentPage();
    }

    return (
      <div className="mobile-main-page">
        <button
          className="btn btn-transparent prev-image"
          onClick={() => this.swipePrev()}
        >
          <SpriteIcon name="arrow-up" className="w100 h100 active text-white" />
        </button>
        <Swiper
          slidesPerView={3}
          loop={true}
          loopedSlides={20}
          direction="vertical"
          pagination={{ clickable: true }}
          onClick={(e) => this.handleMobileClick(e)}
          onSwiper={(swiper) => {
            this.setState({ ...this.state, swiper });
          }}
        >
          {user.rolePreference?.roleId === UserType.Student &&
            renderStudentButtons()}
          {user.rolePreference?.roleId === UserType.Builder &&
            renderBuildButtons()}
          {user.rolePreference?.roleId === UserType.Teacher &&
            renderTeachButtons()}
        </Swiper>
        <button
          className="btn btn-transparent next-image"
          onClick={() => this.swipeNext()}
        >
          <SpriteIcon
            name="arrow-down"
            className="w100 h100 active text-white"
          />
        </button>
      </div>
    );
  }

  render() {
    return (
      <Grid container direction="row" className="mainPageMobile">
        {this.renderMobilePage()}
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
        <ClassInvitationDialog />
      </Grid>
    );
  }
}

export default connector(MainPage);
