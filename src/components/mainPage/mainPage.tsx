import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Hidden } from "@material-ui/core";
import sprite from 'assets/img/icons-sprite.svg';
import "./mainPage.scss";
import actions from "redux/actions/auth";
import brickActions from "redux/actions/brickActions";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import MainPageMenu from "components/baseComponents/pageHeader/MainPageMenu";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog";
import { clearProposal } from "components/localStorage/proposal";
import map from 'components/map';


const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  logout: () => dispatch(actions.logout()),
});

const connector = connect(mapState, mapDispatch);

interface MainPageProps {
  history: any;
  user: User;
  forgetBrick(): void;
  logout(): void;
}

interface MainPageState {
  viewHover: boolean;
  createHober: boolean;
  backHober: boolean;
  animatedName: string;
  swiper: any;
  isPolicyOpen: boolean;
}

class MainPage extends Component<MainPageProps, MainPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      viewHover: false,
      createHober: false,
      backHober: false,
      animatedName: "",
      swiper: null,
      isPolicyOpen: false,
    } as any;

    let count = 0;
    let nameToFill = props.user.firstName
      ? (props.user.firstName as string)
      : "NAME";
    let maxCount = nameToFill.length - 1;

    let setNameInterval = setInterval(() => {
      this.setState({
        ...this.state,
        animatedName: this.state.animatedName + nameToFill[count],
      });
      if (count >= maxCount) {
        clearInterval(setNameInterval);
      }
      count++;
    }, 150);
  }

  setPolicyDialog(isPolicyOpen: boolean) {
    this.setState({ isPolicyOpen });
  }

  viewHoverToggle(viewHover: boolean) {
    this.setState({ viewHover });
  }

  creatingBrick() {
    clearProposal();
    this.props.forgetBrick();
    this.props.history.push(map.ProposalSubject);
  }

  renderViewAllButton() {
    return (
      <div className="view-item-container">
        <button className="btn btn-transparent zoom-item svgOnHover" onClick={() => this.props.history.push("/play/dashboard")}>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#glasses-home"} className="text-theme-orange" />
          </svg>
          <span className="item-description">View All Bricks</span>
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
        </button>
      </div>
    );
  }

  renderCreateButton() {
    return (
      <div className="create-item-container">
        <button className="btn btn-transparent zoom-item svgOnHover" onClick={() => this.creatingBrick()}>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#trowel-home"} className="text-theme-orange" />
          </svg>
          <span className="item-description">Start Building</span>
        </button>
      </div>
    );
  }

  renderWorkButton() {
    return (
      <div className="back-item-container">
        <button className="btn btn-transparent zoom-item svgOnHover" onClick={() => this.props.history.push("/back-to-work")}>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#roller-home"} className="text-theme-orange" />
          </svg>
          <span className="item-description">Back To Work</span>
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

  renderMobilePage() {
    return (
      <Hidden only={["sm", "md", "lg", "xl"]}>
        <div className="mobile-main-page">
          <button className="btn btn-transparent prev-image svgOnHover" onClick={() => this.swipePrev()}>
            <svg className="svg w100 h100 active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#arrow-up"} className="text-white" />
            </svg>
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
            <svg className="svg w100 h100 active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#arrow-down"} className="text-white" />
            </svg>
          </button>
        </div>
      </Hidden>
    );
  }

  render() {
    const { history } = this.props;
    return (
      <Grid container direction="row" className="mainPage">
        <Hidden only={["xs"]}>
          <div className="welcome-col">
            <div className="welcome-box">
              <div>WELCOME</div>
              <div className="smaller">TO BRILLDER,</div>
              <div className="welcome-name">{this.state.animatedName}</div>
            </div>
          </div>
          <div className="first-col">
            <div className="first-item">
              {this.renderViewAllButton()}
              {this.renderCreateButton()}
              {this.renderWorkButton()}
            </div>
            <div className="second-item"></div>
          </div>
          <div className="second-col">
            <div className="first-item"></div>
            <div className="second-item policy-text-container">
              <div className="policy-text">
                <span onClick={() => this.setPolicyDialog(true)}>Privacy Policy</span>
              </div>
            </div>
          </div>
          <MainPageMenu user={this.props.user} history={this.props.history} />
        </Hidden>
        {this.renderMobilePage()}
        <PolicyDialog isOpen={this.state.isPolicyOpen} close={() => this.setPolicyDialog(false)} />
      </Grid>
    );
  }
}

export default connector(MainPage);
