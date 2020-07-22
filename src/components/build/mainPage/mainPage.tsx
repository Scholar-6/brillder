import React, { Component } from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Grid, Hidden } from "@material-ui/core";
import sprite from '../../../assets/img/icons-sprite.svg';
import "./mainPage.scss";
import actions from "redux/actions/auth";
import brickActions from "redux/actions/brickActions";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';

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
}

class MainPage extends Component<MainPageProps, MainPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      viewHover: false,
      createHober: false,
      backHober: false,
      animatedName: "",
      swiper: null
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

  viewHoverToggle(viewHover: boolean) {
    this.setState({ viewHover });
  }

  creatingBrick() {
    this.props.forgetBrick();
    this.props.history.push("/build/new-brick/subject");
  }

  renderViewAllButton() {
    return (
      <button className="btn btn-transparent zoom-item svgOnHover" onClick={() => this.props.history.push("/play/dashboard")}>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#glasses"} className="text-theme-orange" />
        </svg>
        <span className="item-description">View All Bricks</span>
      </button>
    );
  }

  renderCreateButton() {
    return (
      <button className="btn btn-transparent zoom-item svgOnHover" onClick={() => this.props.history.push("/build/new-brick/brick-title")}>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#shovel"} className="text-theme-orange" />
        </svg>
        <span className="item-description">Start Building</span>
      </button>
    );
  }

  renderWorkButton() {
    return (
      <button className="btn btn-transparent zoom-item svgOnHover" onClick={() => this.props.history.push("/back-to-work")}>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#roller"} className="text-theme-orange" />
        </svg>
        <span className="item-description">Back To Work</span>
      </button>
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
          <Grid container justify="center">
            <div onClick={() => this.swipePrev()}>
              <img alt="" className="prev-image" src="/feathericons/chevron-up-grey.png" />
            </div>
          </Grid>
          <Swiper
            slidesPerView={3}
            loop={true}
            loopedSlides={20}
            direction="vertical"
            style={{ height: '80%' }}
            onSwiper={swiper => {
              this.setState({ ...this.state, swiper });
            }}
          >
            <SwiperSlide>{this.renderViewAllButton()}</SwiperSlide>
            <SwiperSlide>{this.renderCreateButton()}</SwiperSlide>
            <SwiperSlide>{this.renderWorkButton()}</SwiperSlide>
          </Swiper>
          <Grid container justify="center">
            <div onClick={() => this.swipeNext()}>
              <img alt="" className="next-image" src="/feathericons/chevron-down-grey.png" />
            </div>
          </Grid>
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
              <div className="view-item-container">
                <button className="btn btn-transparent zoom-item svgOnHover" onClick={() => history.push("/play/dashboard")}>
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#glasses"} className="text-theme-orange" />
                  </svg>
                  <span className="item-description">View All Bricks</span>
                </button>
              </div>
              <div className="create-item-container">
                <button className="btn btn-transparent zoom-item svgOnHover" onClick={() => this.creatingBrick()}>
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#shovel"} className="text-theme-orange" />
                  </svg>
                  <span className="item-description">Start Building</span>
                </button>
              </div>
              <div className="back-item-container">
                <button className="btn btn-transparent zoom-item svgOnHover" onClick={() => history.push("/back-to-work")}>
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#roller"} className="text-theme-orange" />
                  </svg>
                  <span className="item-description">Back To Work</span>
                </button>
              </div>
            </div>
            <div className="second-item"></div>
          </div>
          <div className="second-col">
            <div className="first-item"></div>
            <div className="second-item"></div>
          </div>
          <div className="logout-button" onClick={this.props.logout}>
            <Grid container alignContent="center">
              <div style={{ position: "relative" }}>
                <div className="logout-image" />
              </div>
              <div>
                <Grid
                  container
                  alignContent="center"
                  style={{ height: "100%" }}
                >
                  <span className="logout-text">LOGOUT</span>
                </Grid>
              </div>
            </Grid>
          </div>
        </Hidden>
        {this.renderMobilePage()}
      </Grid>
    );
  }
}

export default connector(MainPage);
