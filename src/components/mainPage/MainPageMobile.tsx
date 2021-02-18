import React, { Component } from "react";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid } from "@material-ui/core";
import 'swiper/swiper.scss';

import './themes/MainPageMobile.scss';
import actions from "redux/actions/auth";
import { RolePreference, User, UserType } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import map from 'components/map';
import { Notification } from 'model/notifications';

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


const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
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
  isStudent: boolean;
  isBuilder: boolean;

  // for students
  isMyLibraryOpen: boolean;
  isBackToWorkOpen: boolean;
  isTryBuildOpen: boolean;

  isSwiping: boolean;

  // for mobile popopup
  isDesktopOpen: boolean;
  secondaryLabel: string;
  secondPart: string;
}

class MainPage extends Component<MainPageProps, MainPageState> {
  constructor(props: MainPageProps) {
    super(props);

    const { rolePreference } = props.user;

    const isStudent = rolePreference?.roleId === RolePreference.Student;
    const isBuilder = rolePreference?.roleId === RolePreference.Builder;

    this.state = {
      swiper: null,
      notificationExpanded: false,
      isMyLibraryOpen: false,
      isBackToWorkOpen: false,
      isTryBuildOpen: false,
      isSwiping: false,

      isStudent,
      isBuilder,

      isDesktopOpen: false,
      secondaryLabel: '',
      secondPart: ' not yet been optimised for mobile devices.'
    } as any;
  }

  renderCreateButton() {
    return (
      <div className="create-item-container" onClick={() => {
        if (!this.state.isSwiping) {
          this.setState({
            isDesktopOpen: true,
            secondaryLabel: ''
          });
        }
      }}>
        <button className="btn btn-transparent zoom-item">
          <SpriteIcon name="trowel-home" className="text-theme-light-blue" />
          <span className="item-description">Build Bricks</span>
        </button>
      </div>
    );
  }

  renderLibraryButton() {
    return (
      <LibraryButton
        isActive={true} isMobile={true} history={this.props.history} isSwiping={this.state.isSwiping}
        onClick={() => this.setState({ isMyLibraryOpen: true })}
        onMobileClick={() => {
          this.setState({
            isDesktopOpen: true,
            secondaryLabel: 'Your Library has' + this.state.secondPart
          });
        }}
      />
    );
  }

  renderAssignmentsButton() {
    return (
      <div className="back-item-container" onClick={() => {
        if (!this.state.isSwiping) {
          this.props.history.push(map.AssignmentsPage);
        }
      }}>
        <button className="btn btn-transparent text-theme-orange zoom-item">
          <BlocksIcon />
          <span className="item-description">
            {this.props.user.rolePreference?.roleId === UserType.Teacher ? 'Shared with Me' : 'Assignments'}
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
      const maxY = height / 3 * 2;

      const finished = () => {
        this.setState({ isSwiping: true });
        setTimeout(() => this.setState({ isSwiping: false }), 200);
      }

      if (e.touches.currentY < minY) {
        this.state.swiper.slidePrev();
        finished();
      } else if (e.touches.currentY > maxY) {
        this.state.swiper.slideNext();
        finished();
      }
    }
  }

  renderMobilePage() {
    const { user } = this.props;

    const firstButton = () => {
      return (
        <SwiperSlide>
          <MobileButtonWrap>
            <FirstButton user={user} history={this.props.history} disabled={this.state.isSwiping} />
          </MobileButtonWrap>
        </SwiperSlide>
      );
    }

    const renderStudentButtons = () => {
      const buttons = [];
      buttons.push(firstButton());
      buttons.push(<SwiperSlide>{this.renderAssignmentsButton()}</SwiperSlide>);
      buttons.push(<SwiperSlide>{this.renderLibraryButton()}</SwiperSlide>);
      buttons.push(<SwiperSlide>{this.renderCreateButton()}</SwiperSlide>);
      return buttons;
    }

    const renderBuildButtons = () => {
      const buttons = [];
      buttons.push(firstButton());
      buttons.push(<SwiperSlide>{this.renderCreateButton()}</SwiperSlide>);
      buttons.push(<SwiperSlide>{this.renderAssignmentsButton()}</SwiperSlide>);
      return buttons;
    }

    const renderTeachButtons = () => {
      const buttons = [];
      buttons.push(firstButton());
      buttons.push(<SwiperSlide><TeachButton history={this.props.history} disabled={true} onMobileClick={() => {
        if (!this.state.isSwiping) {
          this.setState({
            isDesktopOpen: true,
            secondaryLabel: ''
          });
        }
      }} /></SwiperSlide>);
      buttons.push(<SwiperSlide>{this.renderCreateButton()}</SwiperSlide>);
      buttons.push(<SwiperSlide>{this.renderAssignmentsButton()}</SwiperSlide>);
      return buttons;
    }

    return (
      <div className="mobile-main-page">
        <button className="btn btn-transparent prev-image" onClick={() => this.swipePrev()}>
          <SpriteIcon name="arrow-up" className="w100 h100 active text-white" />
        </button>
        <Swiper
          slidesPerView={3}
          loop={true}
          loopedSlides={20}
          direction="vertical"
          pagination={{ clickable: true }}
          onClick={(e) => this.handleMobileClick(e)}
          onSwiper={swiper => {
            this.setState({ ...this.state, swiper });
          }}
        >
          {user.rolePreference?.roleId === UserType.Student && renderStudentButtons()}
          {user.rolePreference?.roleId === UserType.Builder && renderBuildButtons()}
          {user.rolePreference?.roleId === UserType.Teacher && renderTeachButtons()}
        </Swiper>
        <button className="btn btn-transparent next-image" onClick={() => this.swipeNext()}>
          <SpriteIcon name="arrow-down" className="w100 h100 active text-white" />
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
          toggleNotification={() => this.setState({ notificationExpanded: !this.state.notificationExpanded })}
        />
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
        <DesktopVersionDialogV2
          isOpen={this.state.isDesktopOpen} secondaryLabel={this.state.secondaryLabel}
          onClick={() => this.setState({ isDesktopOpen: false })}
        />
        <ClassInvitationDialog />
      </Grid>
    );
  }
}

export default connector(MainPage);
