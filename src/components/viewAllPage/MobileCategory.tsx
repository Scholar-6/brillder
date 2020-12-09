import "./ViewAll.scss";
import React, { Component } from "react";
import { Box, Grid, Grow } from "@material-ui/core";
import { connect } from "react-redux";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import brickActions from "redux/actions/brickActions";
import actions from 'redux/actions/requestFailed';
import map from 'components/map';
import { getAssignmentIcon } from "components/services/brickService";

import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";
import ExpandedMobileBrick from "components/baseComponents/ExpandedMobileBrickDescription";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getBrickColor } from "services/brick";
import { isMobile } from "react-device-detect";
import { getPublicBricks, searchPublicBricks } from "services/axios/brick";


const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(mapState, mapDispatch);

interface BricksListProps {
  user: User;
  history: any;
  forgetBrick(): void;
  requestFailed(e: string): void;
}

interface BricksListState {
  bricks: Array<Brick>;
  searchString: string;
  isSearching: boolean;
  finalBricks: Brick[];
  shown: boolean;
}

class MobileCategoryPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);
    this.state = {
      bricks: [],
      finalBricks: [],
      searchString: "",
      isSearching: false,
      shown: false,
    };

    this.loadData();
  }

  async loadData() {
    const bricks = await getPublicBricks();
    if (bricks) {
      this.setState({
        ...this.state,
        bricks,
        shown: true,
        finalBricks: bricks,
      });
    } else {
      this.props.requestFailed("Can`t get bricks");
    }
  }

  moveToPlay(brickId: number) {
    this.props.history.push(`/play/brick/${brickId}/intro`);
  }

  move(brickId: number) {
    if (isMobile) {
      document.body.requestFullscreen().then(() => {
        this.moveToPlay(brickId);
      });
    } else {
      this.moveToPlay(brickId);
    }
  }

  hideBricks() {
    const { finalBricks } = this.state;
    finalBricks.forEach(brick => brick.expanded = false);
  }

  handleClick(index: number) {
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

  async search() {
    const { searchString } = this.state;
    const bricks = await searchPublicBricks(searchString);
    if (bricks) {
      this.hideBricks();
      this.setState({
        ...this.state,
        finalBricks: bricks,
        isSearching: true,
      });
    } else {
      this.props.requestFailed("Can`t get bricks");
    }
  }

  renderBrick = (brick: Brick, key: number) => {
    const color = !brick.subject ? "#B0B0AD" : brick.subject.color;
    const circleIcon = getAssignmentIcon(brick);
    let className = 'sorted-brick absolute-container';

    if (brick.expanded) {
      className += " brick-hover";
    }
    
    return (
      <Grow
        in={this.state.shown}
        style={{ transformOrigin: "0 0 0" }}
        timeout={key * 150}
      >
        <div key={key} className="main-brick-container">
          <Box className="brick-container">
            <div className={className} onClick={() => this.handleClick(key)}>
              <ShortBrickDescription
                brick={brick}
                color={color}
                isMobile={true}
                circleIcon={circleIcon}
                isExpanded={brick.expanded}
                searchString=""
                move={() => this.move(brick.id)}
              />
            </div>
          </Box>
        </div>
      </Grow>
    );
  };

  renderSortedBricks = () => {
    let bricksList = [];
    for (let i = 0; i < this.state.finalBricks.length; i++) {
      if (this.state.finalBricks[i]) {
        bricksList.push(this.renderBrick(this.state.finalBricks[i], i));
      }
    }
    return bricksList;
  };

  creatingBrick() {
    this.props.forgetBrick();
    this.props.history.push(map.ProposalSubject);
  }

  renderExpandedBrick(brick: Brick) {
    let color = getBrickColor(brick);

    return (
      <ExpandedMobileBrick
        brick={brick}
        color={color}
        move={brickId => this.move(brickId)}
        hide={this.hide.bind(this)}
      />
    );
  }

  hide() {
    this.state.bricks.map(b => b.expanded = false);
    this.setState({...this.state});
  }

  renderMobileBricks(expandedBrick: Brick | undefined) {
    if (expandedBrick) {
      return this.renderExpandedBrick(expandedBrick);
    }
    let bricksList = [];
    for (let i = 0; i < this.state.finalBricks.length; i++) {
      const brick = this.state.finalBricks[i]
      if (brick) {
        const color = getBrickColor(brick);
        const circleIcon = getAssignmentIcon(brick);
        bricksList.push(<ShortBrickDescription circleIcon={circleIcon} searchString="" brick={brick} index={i} color={color} />);
      }
    }

    return (
      <Swiper slidesPerView={2}>
        {bricksList.map((b, i) => 
          <SwiperSlide key={i} onClick={() => this.handleClick(i)} style={{ width: '50vw' }}>
            {b}
          </SwiperSlide>
        )}
      </Swiper>
    );
  }

  render() {
    let expandedBrick = this.state.finalBricks.find(b => b.expanded === true);

    let pageClass = 'main-listing dashboard-page mobile-category';
    if (expandedBrick) {
      pageClass += ' expanded';
    }

    return (
      <div className={pageClass}>
        <div className="page-navigation">
          <div className="btn btn-transparent glasses svgOnHover">
            <SpriteIcon name="glasses" className="w100 h100 active text-theme-dark-blue" />
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
          {this.renderMobileBricks(expandedBrick)}
        </div>
        <Grid container direction="row" className="sorted-row">
          <Grid item xs={9} className="brick-row-container">
            <div className="brick-row-title" onClick={() => this.props.history.push('/play/dashboard')}>
              <button className="btn btn-transparent svgOnHover">
                <span>New</span>
                <SpriteIcon name="arrow-down" className="active text-theme-dark-blue" />
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
