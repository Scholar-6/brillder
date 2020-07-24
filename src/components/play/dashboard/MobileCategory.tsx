/* TODO: KEEP THIS FILE for when clicking 'view all', so copy code from src/build/bricksListPage.tsx
i.e. add back button on menu and row along top of 'my bricks'  6/7/2020 */
import "./Dashboard.scss";
import React, { Component } from "react";
import { Box, Grid } from "@material-ui/core";
import axios from "axios";
// @ts-ignore
import { connect } from "react-redux";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";

import sprite from "../../../assets/img/icons-sprite.svg";

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";
import ExpandedMobileBrick from "components/baseComponents/ExpandedMobileBrickDescription";
import { ReduxCombinedState } from "redux/reducers";
import brickActions from "redux/actions/brickActions";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';


const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick())
});

const connector = connect(mapState, mapDispatch);

interface BricksListProps {
  user: User;
  history: any;
  forgetBrick(): void;
}

interface BricksListState {
  bricks: Array<Brick>;
  searchString: string;
  isSearching: boolean;
  finalBricks: Brick[];
}

class MobileCategoryPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);
    this.state = {
      bricks: [],
      finalBricks: [],
      searchString: "",
      isSearching: false,
    };

    axios.get(
      process.env.REACT_APP_BACKEND_HOST + "/bricks/byStatus/" + BrickStatus.Publish,
      { withCredentials: true }
    ).then((res) => {
      this.setState({
        ...this.state,
        bricks: res.data,
        finalBricks: res.data as Brick[],
      });
    }).catch(() => {
      alert("Can`t get bricks");
    });
  }

  move(brickId: number) {
    this.props.history.push(`/play/brick/${brickId}/intro`);
  }

  hideBricks() {
    const { finalBricks } = this.state;
    finalBricks.forEach(brick => brick.expanded = false);
  }

  handleMouseClick(index: number) {
    let { finalBricks } = this.state;
    if (finalBricks[index].expanded === true) {
      finalBricks[index].expanded = false;
      this.setState({ ...this.state });
      return;
    }
    this.hideBricks();
    finalBricks.forEach(brick => brick.expanded = false);
    if (!finalBricks[index].expandFinished) {
      finalBricks[index].expanded = true;
    }
    this.setState({ ...this.state });
  }

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({
        ...this.state,
        searchString,
        finalBricks: this.state.bricks,
        isSearching: false,
      });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  search() {
    const { searchString } = this.state;
    axios
      .post(
        process.env.REACT_APP_BACKEND_HOST + "/bricks/search",
        { searchString },
        { withCredentials: true }
      )
      .then((res) => {
        this.hideBricks();
        const searchBricks = res.data.map((brick: any) => brick.body);
        this.setState({
          ...this.state,
          finalBricks: searchBricks,
          isSearching: true,
        });
      })
      .catch((error) => {
        alert("Can`t get bricks");
      });
  }

  getSortedBrickContainer = (brick: Brick, key: number, row: any = 0) => {
    let color = "";

    if (!brick.subject) {
      color = "#B0B0AD";
    } else {
      color = brick.subject.color;
    }

    let className = `sorted-brick absolute-container brick-row-${row}`;

    if (brick.expanded) {
      className += " brick-hover";
    }

    return (
      <div key={key} className="main-brick-container">
        <Box className="brick-container">
          <div
            className={className}
            onClick={() => this.handleMouseClick(key)}
          >
            <ShortBrickDescription
              brick={brick}
              color={color}
              isMobile={true}
              isExpanded={brick.expanded}
              move={() => this.move(brick.id)}
            />
          </div>
        </Box>
      </div>
    );
  };

  renderSortedBricks = () => {
    let bricksList = [];
    for (let i = 0; i < this.state.finalBricks.length; i++) {
      if (this.state.finalBricks[i]) {
        let row = Math.floor(i / 3);
        bricksList.push(this.getSortedBrickContainer(this.state.finalBricks[i], i, row));
      }
    }
    return bricksList;
  };

  creatingBrick() {
    this.props.forgetBrick();
    this.props.history.push("/build/new-brick/subject");
  }

  renderExpandedBrick(brick: Brick) {
    let color = this.getBrickColor(brick);

    return (
      <ExpandedMobileBrick
        brick={brick}
        color={color}
        move={brickId => this.move(brickId)}
      />
    );
  }

  getBrickColor(brick: Brick) {
    let color = "";
    if (!brick.subject) {
      color = "#B0B0AD";
    } else {
      color = brick.subject.color;
    }
    return color;
  }

  renderMobileBricks() {
    let expandedBrick = this.state.finalBricks.find(b => b.expanded === true);

    if (expandedBrick) {
      return this.renderExpandedBrick(expandedBrick);
    }
    let bricksList = [];
    for (let i = 0; i < this.state.finalBricks.length; i++) {
      const brick = this.state.finalBricks[i]
      if (brick) {
        let color = this.getBrickColor(brick);
        bricksList.push(<ShortBrickDescription brick={brick} index={i} color={color} />);
      }
    }

    return (
      <Swiper slidesPerView={2}>
        {bricksList.map((b, i) => <SwiperSlide key={i} onClick={() => this.handleMouseClick(i)} style={{ width: '50vw' }}>{b}</SwiperSlide>)}
      </Swiper>
    );
  }

  render() {
    return (
      <div className="dashboard-page mobile-category">
        <div className="page-navigation">
          <div className="btn btn-transparent glasses svgOnHover">
            <svg className="svg w100 h100 active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#glasses"} className="text-theme-dark-blue" />
            </svg>
          </div>
          <div className="breadcrumbs">New</div>
        </div>
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          placeholder={"Search Ongoing Projects & Published Bricks…"}
          history={this.props.history}
          search={() => this.search()}
          searching={(v: string) => this.searching(v)}
        />
        <div className="mobile-scroll-bricks">
          {this.renderMobileBricks()}
        </div>
        <Grid container direction="row" className="sorted-row">
          <Grid item xs={9} className="brick-row-container">
            <div className="brick-row-title" onClick={() => this.props.history.push('/play/dashboard')}>
              <button className="btn btn-transparent svgOnHover">
                <span>New</span>
                <svg className="svg active">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#arrow-down"} className="text-theme-dark-blue" />
                </svg>
              </button>
            </div>
            <div className="bricks-list-container">
              {this.renderSortedBricks()}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connector(MobileCategoryPage);
