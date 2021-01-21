import React, { Component } from "react";
import { Box, Grid, Hidden } from "@material-ui/core";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import queryString from 'query-string';
import "swiper/swiper.scss";

import "./ViewAll.scss";
import brickActions from "redux/actions/brickActions";
import { User } from "model/user";
import { Notification } from 'model/notifications';
import { Brick, Subject, SubjectItem } from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin, getAssignmentIcon } from "components/services/brickService";
import { getCurrentUserBricks, getPublicBricks, getPublishedBricks, searchBricks, searchPublicBricks } from "services/axios/brick";
import { getSubjects } from "services/axios/subject";

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";
import ExpandedBrickDescription from "components/baseComponents/ExpandedBrickDescription";
import ExpandedMobileBrick from "components/baseComponents/ExpandedMobileBrickDescription";
import ViewAllFilter, { SortBy } from "./ViewAllFilter";
import ViewAllPagination from "./ViewAllPagination";
import PrivateCoreToggle from "components/baseComponents/PrivateCoreToggle";
import BrickBlock from "components/baseComponents/BrickBlock";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { downKeyPressed, upKeyPressed } from "components/services/key";
import { getBrickColor } from "services/brick";
import { isMobile } from "react-device-detect";
import map from "components/map";
import NoSubjectDialog from "components/baseComponents/dialogs/NoSubjectDialog";
import { clearProposal } from "localStorage/proposal";
import ViewAllMobile from "./ViewAllMobile";
import CreateOneButton from "components/userProfilePage/components/CreateOneButton";
import RecommendButton from "components/userProfilePage/components/RecommendBuilderButton";

import {removeByIndex, sortByPopularity, sortByDate, sortAndFilterBySubject, getCheckedSubjects, prepareVisibleBricks, toggleSubject, renderTitle, hideBricks, expandBrick, sortAllBricks, countSubjectBricks, prepareYourBricks, sortAndCheckSubjects, filterSearchBricks, getCheckedSubjectIds} from './service/viewAll';


interface ViewAllProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
  forgetBrick(): void;
}

interface ViewAllState {
  yourBricks: Array<Brick>;
  bricks: Array<Brick>;
  searchBricks: Array<Brick>;
  searchString: string;
  isSearching: boolean;
  sortBy: SortBy;

  subjects: SubjectItem[];
  userSubjects: Subject[];

  sortedIndex: number;
  finalBricks: Brick[];
  isLoading: boolean;

  noSubjectOpen: boolean;
  activeSubject: SubjectItem;
  dropdownShown: boolean;
  deleteDialogOpen: boolean;
  deleteBrickId: number;

  handleKey(e: any): void;

  isClearFilter: any;
  failedRequest: boolean;
  pageSize: number;
  isAdmin: boolean;
  isCore: boolean;
  shown: boolean;
  isAllSubjects: boolean;
  isViewAll: boolean;
}

class ViewAllPage extends Component<ViewAllProps, ViewAllState> {
  constructor(props: ViewAllProps) {
    super(props);

    let isAdmin = false;
    let pageSize = 15;
    if (props.user) {
      isAdmin = checkAdmin(props.user.roles);
    } else {
      pageSize = 18;
    }

    const values = queryString.parse(props.location.search);
    const searchString = values.searchString as string || '';

    let isViewAll = false;
    if (values.isViewAll) {
      isViewAll = true;
    }

    this.state = {
      yourBricks: [],
      bricks: [],
      sortBy: SortBy.Date,
      subjects: [],
      userSubjects: Object.assign([], props.user.subjects),
      sortedIndex: 0,
      noSubjectOpen: false,
      deleteDialogOpen: false,
      deleteBrickId: -1,
      finalBricks: [],
      dropdownShown: false,
      searchBricks: [],
      searchString,
      activeSubject: {} as SubjectItem,
      isSearching: false,
      pageSize,
      isLoading: true,

      isClearFilter: false,
      failedRequest: false,
      isAdmin,
      isCore: true,
      shown: false,
      isAllSubjects: true,
      isViewAll,
      handleKey: this.handleKey.bind(this)
    };

    this.loadData(values);
  }

  // load bricks when notification come
  componentDidUpdate(prevProps: ViewAllProps) {
    const {notifications} = this.props;
    const oldNotifications = prevProps.notifications;
    if (notifications && oldNotifications) {
      if (notifications.length > oldNotifications.length) {
        this.loadBricks();
      }
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  async handleKey(e: any) {
    if (upKeyPressed(e)) {
      this.moveAllBack();
    } else if (downKeyPressed(e)) {
      this.moveAllNext();
    }
  }

  async loadData(values: queryString.ParsedQuery<string>) {
    if (this.props.user) {
      await this.loadSubjects(values);
    }

    if (values.searchString) {
      this.search();
    } else if (this.props.user) {
      this.loadBricks(values);
    } else {
      this.setState({ ...this.state, failedRequest: true });
      // load bricks for unauthorized users
      const bricks = await getPublicBricks();
      if (bricks) {
        this.setState({ ...this.state, bricks, isLoading: false, finalBricks: bricks, shown: true });
      } else {
        this.setState({ ...this.state, isLoading: false, failedRequest: true });
      }
    }
  }

  /**
   * Load subject and check by query string
   */
  async loadSubjects(values: queryString.ParsedQuery<string>) {
    let subjects = await getSubjects() as SubjectItem[] | null;

    if(subjects) {
      sortAndCheckSubjects(subjects, values);
      this.setState({ ...this.state, subjects });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }
    return subjects;
  }

  async loadBricks(values?: queryString.ParsedQuery<string>) {
    const currentBricks = await getCurrentUserBricks();
    if (currentBricks) {
      let yourBricks = prepareYourBricks(currentBricks);
      this.setState({ ...this.state, yourBricks });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }

    const bricks = await getPublishedBricks();
    if (bricks) {
      let bs = sortAllBricks(bricks);
      let finalBricks = this.filter(bs, this.state.isAllSubjects, this.state.isCore);
      let {subjects} = this.state;
      countSubjectBricks(subjects, bs);
      subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
      if (values && values.isViewAll) {
        subjects.forEach(s => {
          if (s.publicCount > 0) {
            s.checked = true;
          }
        });
        finalBricks = this.filter(bricks, this.state.isAllSubjects, this.state.isCore);
      }
      this.setState({ ...this.state, subjects, bricks, isLoading: false, finalBricks, shown: true });
    } else {
      this.setState({ ...this.state, isLoading: false, failedRequest: true });
    }
  }

  delete(brickId: number) {
    removeByIndex(this.state.bricks, brickId);
    removeByIndex(this.state.finalBricks, brickId);
    removeByIndex(this.state.searchBricks, brickId);
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  moveToPlay(brickId: number) {
    this.props.history.push(map.playIntro(brickId));
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

  handleSortChange = (e: any) => {
    const { state } = this;
    const sortBy = parseInt(e.target.value) as SortBy;
    let { finalBricks } = this.state;
    if (sortBy === SortBy.Date) {
      finalBricks = sortByDate(finalBricks);
    } else if (sortBy === SortBy.Popularity) {
      finalBricks = sortByPopularity(finalBricks);
    }
    this.setState({ ...state, finalBricks, sortBy });
  };

  filter(bricks: Brick[], isAllSubjects: boolean, isCore?: boolean) {
    if (this.state.isSearching) {
      bricks = filterSearchBricks(this.state.searchBricks, this.state.isCore);
    }

    let filterSubjects = [];
    if (isAllSubjects) {
      filterSubjects = getCheckedSubjectIds(this.state.subjects);
    } else {
      let subjects = [];
      for (let subject of this.state.userSubjects) {
        for (let s of this.state.subjects) {
          if (s.id === subject.id) {
            subjects.push(s);
          }
        }
      }
      subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
      filterSubjects = getCheckedSubjectIds(subjects);
    }

    if (isCore) {
      bricks = bricks.filter(b => b.isCore === true);
    } else {
      bricks = bricks.filter(b => !b.isCore)
    }

    if (filterSubjects.length > 0) {
      return sortAndFilterBySubject(bricks, filterSubjects);
    }
    return bricks;
  }

  //region Hide / Expand / Clear Filter
  isFilterClear() {
    return this.state.subjects.some(r => r.checked);
  }
  //endregion

  filterBySubject(id: number) {
    toggleSubject(this.state.subjects, id);
    toggleSubject(this.state.userSubjects, id);

    let checked = this.state.subjects.find(s => s.checked === true);
    if (!checked) {
      this.props.history.push(map.AllSubjects);
    }

    const finalBricks = this.filter(this.state.bricks, this.state.isAllSubjects, this.state.isCore);
    this.setState({ ...this.state, isViewAll: false, shown: false });
    setTimeout(() => {
      try {
        this.setState({ ...this.state, isClearFilter: this.isFilterClear(), finalBricks, shown: true });
      } catch {}
    }, 1400);
  };

  clearSubjects = () => {
    const { state } = this;
    const { subjects, userSubjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    userSubjects.forEach((r: any) => (r.checked = false));
    this.setState({ ...state, isClearFilter: false });
  };

  moveAllBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize) {
      this.setState({ ...this.state, sortedIndex: index - this.state.pageSize });
    }
  }

  moveAllNext() {
    let index = this.state.sortedIndex;
    const { pageSize } = this.state;
    let bricks = this.state.finalBricks;

    if (this.state.isSearching) {
      bricks = filterSearchBricks(this.state.searchBricks, this.state.isCore);
    }

    if (index + pageSize <= bricks.length) {
      this.setState({ ...this.state, sortedIndex: index + this.state.pageSize });
    }
  }

  hideBricks() {
    const { finalBricks, yourBricks } = this.state;
    hideBricks(finalBricks);
    hideBricks(yourBricks);
  }

  yourBricksMouseHover(index: number) {
    let { yourBricks } = this.state;
    this.hideBricks();
    expandBrick(yourBricks, index);
    this.setState({ ...this.state });
  }

  yourBricksMouseLeave() {
    this.hideBricks();
    this.setState({ ...this.state });
  }

  handleMouseHover(index: number) {
    let { finalBricks } = this.state;
    if (finalBricks[index] && finalBricks[index].expanded) return;

    this.hideBricks();
    expandBrick(finalBricks, index);
    this.setState({ ...this.state });
  }

  handleMobileClick(index: number) {
    let { finalBricks } = this.state;
    if (finalBricks[index].expanded === true) {
      this.hideBricks();
      this.setState({ ...this.state });
      return;
    }
    this.hideBricks();
    expandBrick(finalBricks, index);
    this.setState({ ...this.state });
  }

  handleYourMobileClick(brick: Brick) {
    this.hideBricks();
    brick.expanded = true;
    this.setState({ ...this.state });
  }

  handleMouseLeave() {
    this.hideBricks();
    this.setState({ ...this.state });
  }

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({ ...this.state, deleteDialogOpen: true, deleteBrickId });
  }

  handleDeleteClose() {
    this.setState({ ...this.state, deleteDialogOpen: false });
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

  showDropdown() { this.setState({ ...this.state, dropdownShown: true }) }
  hideDropdown() { this.setState({ ...this.state, dropdownShown: false }) }

  async search() {
    const { searchString } = this.state;
    this.setState({shown: false});
    let bricks: Brick[] | null = [];
    if (this.props.user) {
      bricks = await searchBricks(searchString);
    } else {
      bricks = await searchPublicBricks(searchString);
    }

    setTimeout(() => {
      try {
        if (bricks) {
          this.hideBricks();
          const finalBricks = this.filter(bricks, this.state.isAllSubjects, this.state.isCore);
          this.setState({
            ...this.state,
            searchBricks: bricks,
            finalBricks,
            shown: true,
            isLoading: false,
            isSearching: true,
          });
        } else {
          this.setState({ ...this.state, isLoading: false, failedRequest: true });
        }
      } catch {
        this.setState({isLoading: false, failedRequest: true});
      }
    }, 1400);
  }

  renderExpandedBrick(color: string, brick: Brick) {
    return (
      <ExpandedBrickDescription
        userId={this.props.user.id}
        isAdmin={this.state.isAdmin}
        searchString=""
        color={color}
        brick={brick}
        move={(brickId) => this.move(brickId)}
        onDelete={brickId => this.handleDeleteOpen(brickId)}
      />
    );
  }

  renderBrickContainer = (brick: Brick, key: number) => {
    let color = getBrickColor(brick);

    return (
      <div key={key} className="main-brick-container">
        <Box className="brick-container">
          <div
            className={`absolute-container brick-row-0 ${brick.expanded ? "brick-hover" : ""}`}
            onMouseEnter={() => this.yourBricksMouseHover(key)}
            onMouseLeave={() => this.yourBricksMouseLeave()}
          >
            {brick.expanded ? (
              this.renderExpandedBrick(color, brick)
            ) : (
                <ShortBrickDescription searchString="" brick={brick} />
              )}
          </div>
        </Box>
      </div>
    );
  };

  renderSortedBricks = (bricks: Brick[]) => {
    let data = prepareVisibleBricks(
      this.state.sortedIndex,
      this.state.pageSize,
      bricks
    );
    return data.map(item => {
      let circleIcon = '';
      if (this.props.user) {
        circleIcon = getAssignmentIcon(item.brick);
        if (item.brick.editor?.id === this.props.user.id) {
          circleIcon = 'award';
        }
      }

      let searchString = ''
      if (this.state.isSearching) {
        searchString = this.state.searchString;
      }

      return (
        <BrickBlock
          brick={item.brick}
          index={item.index}
          row={item.row + 1}
          user={this.props.user}
          key={item.index}
          searchString={searchString}
          shown={this.state.shown}
          history={this.props.history}
          circleIcon={circleIcon}
          handleDeleteOpen={(brickId) => this.handleDeleteOpen(brickId)}
          handleMouseHover={() => this.handleMouseHover(item.key)}
          handleMouseLeave={() => this.handleMouseLeave()}
          isPlay={true}
        />
      );
    });
  };

  //region Mobile
  renderMobileExpandedBrick(brick: Brick) {
    let color = getBrickColor(brick);

    return (
      <ExpandedMobileBrick
        brick={brick}
        color={color}
        move={(brickId) => this.move(brickId)}
      />
    );
  }

  renderMobileUpperBricks(expandedBrick: Brick | undefined) {
    if (expandedBrick) {
      return this.renderMobileExpandedBrick(expandedBrick);
    }

    let bricksList = [];
    for (const brick of this.state.yourBricks) {
      bricksList.push(
        <ShortBrickDescription
          brick={brick}
          searchString=""
          onClick={() => this.handleYourMobileClick(brick)}
        />
      );
    }
    return (
      <Swiper slidesPerView={2}>
        {bricksList.map((b, i) => (
          <SwiperSlide key={i} style={{ width: "50vw" }}>
            {b}
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
  //region Mobile

  renderYourBrickRow = () => {
    let bricksList = [];
    let index = 0;
    for (let i = index; i < index + 3; i++) {
      const { yourBricks } = this.state;
      if (yourBricks[i]) {
        bricksList.push(this.renderBrickContainer(yourBricks[i], i));
      }
    }
    return bricksList;
  };

  renderEmptyCategory(name: string) {
    return (
      <div className="brick-row-title">
        <button className="btn btn-transparent svgOnHover">
          <span>{name}</span>
          <SpriteIcon name="arrow-right" className="active text-theme-dark-blue" />
        </button>
      </div>
    );
  }

  renderMobileGlassIcon() {
    return (
      <div className="page-navigation">
        <div className="btn btn-transparent glasses svgOnHover">
          <SpriteIcon name="glasses" className="w100 h100 active text-theme-dark-blue" />
        </div>
        <div className="breadcrumbs">All</div>
      </div>
    );
  }

  toggleCore() {
    const isCore = !this.state.isCore;
    this.setState({ isCore, shown: false, sortedIndex: 0 });
    setTimeout(() => {
      try {
        const finalBricks = this.filter(this.state.bricks, this.state.isAllSubjects, isCore);
        this.setState({ shown: true, finalBricks, sortedIndex: 0 });
      } catch {}
    }, 1400);
  }

  renderMainTitle(filterSubjects: number[]) {
    if (filterSubjects.length === 1) {
      const subjectId = filterSubjects[0];
      const subject = this.state.subjects.find(s => s.id === subjectId);
      return subject?.name;
    } else if (this.state.isViewAll) {
      return "View All";
    } else if (filterSubjects.length > 1) {
      return "Filtered";
    } else if (this.state.isSearching) {
      return this.state.searchString;
    }

    if (this.state.isAllSubjects) {
      return 'All subjects'
    }
    return 'My subjects';
  }

  moveToCreateOne() {
    const filterSubjects = getCheckedSubjects(this.state.subjects);
    if (filterSubjects.length === 1) {
      const subjectId = filterSubjects[0].id;
      const {subjects} = this.props.user;
      if (subjects) {
        for (let s of subjects) {
          if (s.id === subjectId) {
            clearProposal();
            this.props.forgetBrick();
            this.props.history.push(map.ProposalSubject + '?selectedSubject=' + subjectId);
          } else {
            this.setState({noSubjectOpen: true, activeSubject: filterSubjects[0]});
          }
        }
      }
    } else {
      this.props.history.push(map.ProposalSubject);
    }
  }

  renderNoBricks() {
    return (
      <div className="main-brick-container">
        <div className="centered text-theme-dark-blue title no-found">
          Sorry, no bricks found
        </div>
        <CreateOneButton onClick={this.moveToCreateOne.bind(this)} />
        <RecommendButton />
      </div>
    );
  }

  renderFirstRow(filterSubjects: number[], bricks: Brick[]) {
    if (bricks.length === 0) {
      return this.renderNoBricks();
    }
    if (this.state.isSearching || filterSubjects.length !== 0) {
      return (
        <div className="main-brick-container">
          <div className="centered text-theme-dark-blue title found">
            {renderTitle(bricks)}
            <CreateOneButton onClick={this.moveToCreateOne.bind(this)} />
            <RecommendButton />
          </div>
        </div>
      );
    }
    return <div className="bricks-list">{this.renderYourBrickRow()}</div>;
  }

  renderDesktopBricks(bricks: Brick[]) {
    const filterSubjects = getCheckedSubjectIds(this.state.subjects);

    return (
      <div>
        <div className={`brick-row-title main-title uppercase ${filterSubjects.length === 1 && 'subject-title'}`}>
          {this.renderMainTitle(filterSubjects)}
        </div>
        {this.props.user && <PrivateCoreToggle
          isViewAll={true}
          isCore={this.state.isCore}
          onSwitch={() => this.toggleCore()}
        />}
        <div className="bricks-list-container bricks-container-mobile">
          {this.renderFirstRow(filterSubjects, bricks)}
          <div className="bricks-list">{this.renderSortedBricks(bricks)}</div>
        </div>
        <ViewAllPagination
          pageSize={this.state.pageSize}
          sortedIndex={this.state.sortedIndex}
          bricksLength={bricks.length}
          moveAllNext={() => this.moveAllNext()}
          moveAllBack={() => this.moveAllBack()}
        />
      </div>
    );
  }

  renderDesktopBricksColumn(bricks: Brick[]) {
    return (
      <Grid item xs={9} className="brick-row-container">
        {this.renderDesktopBricks(bricks)}
      </Grid>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <PageLoader content="...Getting Bricks..." />;
    }

    let bricks = this.state.finalBricks;
    if (this.state.isSearching) {
      bricks = filterSearchBricks(this.state.searchBricks, this.state.isCore);
    }

    let expandedBrick = undefined;
    let pageClass = "main-listing dashboard-page";
    if (isMobile) {
      expandedBrick = this.state.yourBricks.find(b => b.expanded === true);
      if (!expandedBrick) {
        expandedBrick = this.state.finalBricks.find(b => b.expanded === true);
      }
      if (expandedBrick) {
        pageClass += ' expanded';
      }
    }

    return (
      <div className={pageClass}>
        {this.renderMobileGlassIcon()}
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          placeholder={"Search Subjects, Topics, Titles & more"}
          history={this.props.history}
          search={() => this.search()}
          searching={(v) => this.searching(v)}
        />
        <Hidden only={["sm", "md", "lg", "xl"]}>
          <div className="mobile-scroll-bricks">
            {this.renderMobileUpperBricks(expandedBrick)}
          </div>
        </Hidden>
        <Grid container direction="row" className="sorted-row">
          <ViewAllFilter
            user={this.props.user}
            sortBy={this.state.sortBy}
            subjects={this.state.subjects}
            userSubjects={this.state.userSubjects}
            isCore={this.state.isCore}
            isClearFilter={this.state.isClearFilter}
            isAllSubjects={this.state.isAllSubjects}
            setAllSubjects={isAllSubjects => {
              const finalBricks = this.filter(this.state.bricks, isAllSubjects, this.state.isCore);
              this.setState({isAllSubjects, finalBricks, sortedIndex: 0 });
            }}
            handleSortChange={e => this.handleSortChange(e)}
            clearSubjects={() => this.clearSubjects()}
            filterBySubject={id => this.filterBySubject(id)}
          />
          <Hidden only={["xs"]}>
            {this.renderDesktopBricksColumn(bricks)}
          </Hidden>
          <Hidden only={["sm", "md", "lg", "xl"]}>
            <ViewAllMobile
              sortedIndex={this.state.sortedIndex}
              pageSize={this.state.pageSize}
              finalBricks={this.state.finalBricks}
              history={this.props.history}
              handleMobileClick={this.handleMobileClick.bind(this)}
              move={this.move.bind(this)}
            />
          </Hidden>
        </Grid>
        <DeleteBrickDialog
          isOpen={this.state.deleteDialogOpen}
          brickId={this.state.deleteBrickId}
          close={() => this.handleDeleteClose()}
          onDelete={(brickId) => this.delete(brickId)}
        />
        <FailedRequestDialog
          isOpen={this.state.failedRequest}
          close={() => this.setState({ ...this.state, failedRequest: false })}
        />
        <NoSubjectDialog
          isOpen={this.state.noSubjectOpen}
          subject={this.state.activeSubject}
          history={this.props.history}
          close={() => this.setState({noSubjectOpen: false})}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
});

export default connect(mapState, mapDispatch)(ViewAllPage);
