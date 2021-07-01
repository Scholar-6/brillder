import React, { Component } from "react";
import { Box, Grid, Grow } from "@material-ui/core";
import { connect } from "react-redux";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { Swiper, SwiperSlide } from 'swiper/react';
import queryString from 'query-string';
import 'swiper/swiper.scss';

import { Brick, Subject } from "model/brick";
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
import { getPublicBricks, searchPublicBricks } from "services/axios/brick";
import BrickCircle from "components/baseComponents/BrickCircle";
import routes from "components/play/routes";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";


const MobileTheme = React.lazy(() => import('./themes/ViewAllPageMobileTheme'));

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
  location: any;
  isSearching: boolean;
  forgetBrick(): void;
  requestFailed(e: string): void;
}

interface BricksListState {
  bricks: Array<Brick>;
  searchString: string;
  isSearching: boolean;
  finalBricks: Brick[];
  isViewAll: boolean;
  subjects: Subject[];
  subjectId: number;
  shown: boolean;
}

class MobileCategoryPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    const values = queryString.parse(props.location.search);
    const searchString = values.searchString as string || '';
    if (!values.isViewAll && !values.subjectId && !values.searchString && !this.props.isSearching && !values.subjectGroup ) {
      //this.props.history.push(map.SubjectCategories);
    }

    let isViewAll = false;
    if (values.isViewAll) {
      isViewAll = true;
    }

    let subjectId = -1;
    if (values.subjectId) {
      try {
        subjectId = parseInt(values.subjectId as string);
      } catch { }
    }

    this.state = {
      bricks: [],
      finalBricks: [],
      searchString: searchString,
      isSearching: this.props.isSearching ? this.props.isSearching : false,
      isViewAll,
      subjects: [],
      subjectId,
      shown: false,
    };

    this.loadData();
  }

  async loadData() {
    const bricks = await getPublicBricks();
    if (bricks) {
      const subjects:Subject[] = [];
      let finalBricks = bricks;
      for (let brick of bricks) {
        let res = subjects.find(s => s.id === brick.subjectId);
        if (!res) {
          subjects.push({...brick.subject} as Subject);
        }
      }
      if (this.state.subjectId > 0) {
        finalBricks = bricks.filter(b => b.subjectId === this.state.subjectId);
      }
      this.setState({
        ...this.state,
        bricks,
        subjects,
        shown: true,
        finalBricks,
      });
    } else {
      this.props.requestFailed("Can`t get bricks");
    }
  }

  moveToPlay(brickId: number) {
    this.props.history.push(routes.phonePrep(brickId));
  }

  move(brickId: number) {
    if (document.body.requestFullscreen) {
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

  handleClick(id: number) {
    const { finalBricks } = this.state;
    const brick = finalBricks.find(b => b.id === id);
    if (brick) {
      const isExpanded = brick.expanded;
      finalBricks.forEach(brick => brick.expanded = false);
      brick.expanded = !isExpanded;
      this.setState({ ...this.state });
    }
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

  renderBrick(brick: Brick, key: number) {
    const color = !brick.subject ? "#B0B0AD" : brick.subject.color;
    const circleIcon = getAssignmentIcon(brick);
    let className = 'sorted-brick absolute-container';

    if (brick.expanded) {
      className += " brick-hover";
    }

    return (
      <Grow
        key={key}
        in={this.state.shown}
        style={{ transformOrigin: "0 0 0" }}
        timeout={key * 150}
      >
        <div key={key} className="main-brick-container">
          <Box className="brick-container">
            <div className={className} onClick={() => this.handleClick(brick.id)}>
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
  }

  selectSubject(subject: Subject) {
    const finalBricks = this.state.bricks.filter(b => b.subject?.id === subject.id);
    this.setState({finalBricks});
  }

  renderSubject(subject: Subject, key: number) {
    const {color} = subject;

    return (
      <Grow
        key={key}
        in={this.state.shown}
        style={{ transformOrigin: "0 0 0" }}
        timeout={key * 150}
      >
        <div key={key} className="main-brick-container">
          <Box className="brick-container">
            <div className='sorted-brick absolute-container' onClick={() => this.selectSubject(subject)}>
              <div className="short-description subject">
                <BrickCircle
                  color={color}
                  canHover={true}
                  label=""
                  onClick={() => {}}
                />
                <span>{subject.name}</span>
              </div>
            </div>
          </Box>
        </div>
      </Grow>
    );
  }

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
    this.props.history.push(map.ProposalSubjectLink);
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
    this.setState({ ...this.state });
  }

  renderMobileBricks(expandedBrick: Brick | undefined) {
    if (this.state.finalBricks.length === 0) {
      return <div className="bricks-no-found bold">Sorry, no bricks found</div>
    }
    if (expandedBrick) {
      return this.renderExpandedBrick(expandedBrick);
    }

    const sorted = this.state.finalBricks.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());

    let bricksList: any[] = [];
    for (let i = 0; i < sorted.length; i++) {
      const brick = sorted[i]
      if (brick) {
        const color = getBrickColor(brick);
        const circleIcon = getAssignmentIcon(brick);
        bricksList.push({
          brick,
          elem: <PhoneTopBrick16x9 circleIcon={circleIcon} searchString="" brick={brick} index={i} color={color} />
        });
      }
    }

    return (
      <Swiper slidesPerView={1}>
        {bricksList.map((b, i) =>
          <SwiperSlide key={i} onClick={() => this.handleClick(b.brick.id)}>
            {i === 0 && <div className="week-brick">Brick of the week</div>}
            {b.elem}
          </SwiperSlide>
        )}
      </Swiper>
    );
  }

  renderSubjects() {
    return (
      <Grid item xs={9} className="brick-row-container">
        <div className="brick-row-title" onClick={() => this.props.history.push('/play/dashboard')}>
          <button className="btn btn-transparent svgOnHover">
            <span>Try one of the following:</span>
          </button>
        </div>
        <div className="bricks-list-container no-bottom-padding">
          {this.state.subjects.map(this.renderSubject.bind(this))}
        </div>
      </Grid>
    );
  }

  renderBricks() {
    return (
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
    );
  }

  render() {
    const expandedBrick = this.state.finalBricks.find(b => b.expanded === true);

    let pageClass = 'main-listing dashboard-page mobile-category';
    if (expandedBrick) {
      pageClass += ' expanded';
    }

    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />
        <div className={pageClass}>
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
            {this.state.finalBricks.length === 0 ? this.renderSubjects() : this.renderBricks()}
          </Grid>
        </div>
      </React.Suspense>
    );
  }
}

export default connector(MobileCategoryPage);
