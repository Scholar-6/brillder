import React, { Component } from "react";
import { Grid, Hidden } from "@material-ui/core";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import queryString from 'query-string';
import { Route, Switch } from 'react-router-dom';
import "swiper/swiper.scss";
import { isIPad13, isMobile, isTablet } from 'react-device-detect';

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
import ExpandedMobileBrick from "components/baseComponents/ExpandedMobileBrickDescription";
import ViewAllFilter, { SortBy } from "./components/ViewAllFilter";
import ViewAllPagination from "./ViewAllPagination";
import PrivateCoreToggle from "components/baseComponents/PrivateCoreToggle";
import BrickBlock from "components/baseComponents/BrickBlock";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { downKeyPressed, upKeyPressed } from "components/services/key";
import { getBrickColor } from "services/brick";
import map from "components/map";
import NoSubjectDialog from "components/baseComponents/dialogs/NoSubjectDialog";
import { clearProposal } from "localStorage/proposal";
import ViewAllMobile from "./ViewAllMobile";
import CreateOneButton from "components/viewAllPage/components/CreateOneButton";
import RecommendButton from "components/viewAllPage/components/RecommendBuilderButton";

import { removeByIndex, sortByPopularity, prepareUserSubjects, sortByDate, sortAndFilterBySubject, getCheckedSubjects, prepareVisibleBricks, toggleSubject, renderTitle, hideBricks, expandBrick, sortAllBricks, countSubjectBricks, prepareYourBricks, sortAndCheckSubjects, filterSearchBricks, getCheckedSubjectIds } from './service/viewAll';
import { filterByCurretUser } from "components/backToWorkPage/service";
import SubjectsColumn from "./allSubjectsPage/components/SubjectsColumn";
import AllSubjects from "./allSubjectsPage/AllSubjects";
import MobileCategory from "./MobileCategory";


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

const MobileTheme = React.lazy(() => import('./themes/ViewAllPageMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/ViewAllPageTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/ViewAllPageDesktopTheme'));

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
    if (!values.isViewAll && !values.subjectId && !values.searchString) {
      this.props.history.push(map.AllSubjects);
    }

    let isViewAll = false;
    if (values.isViewAll) {
      isViewAll = true;
    }

    this.state = {
      yourBricks: [],
      bricks: [],
      sortBy: SortBy.Date,
      subjects: [],
      userSubjects: props.user ? Object.assign([], props.user.subjects) : [],
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
    const { notifications } = this.props;
    const oldNotifications = prevProps.notifications;
    if (notifications && oldNotifications) {
      if (notifications.length > oldNotifications.length) {
        this.loadBricks();
      }
    }
  }

  checkSubjectsWithBricks(subjects: SubjectItem[]) {
    subjects.forEach(s => {
      if (this.state.isCore) {
        if (s.publicCount > 0) {
          s.checked = true;
        }
      } else {
        if (s.personalCount && s.personalCount > 0) {
          s.checked = true;
        }
      }
    });
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
    await this.loadSubjects(values);

    if (values.searchString) {
      this.search();
    } else if (this.props.user) {
      this.loadBricks(values);
    } else {
      this.loadUnauthorizedBricks(values);
    }
  }

  /**
   * Load subject and check by query string
   */
  async loadSubjects(values: queryString.ParsedQuery<string>) {
    let subjects = await getSubjects() as SubjectItem[] | null;

    if (subjects) {
      sortAndCheckSubjects(subjects, values);
      this.setState({ ...this.state, subjects });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }
    return subjects;
  }

  async loadUnauthorizedBricks(values?: queryString.ParsedQuery<string>) {
    const bricks = await getPublicBricks();
    if (bricks) {
      let finalBricks = this.filter(bricks, this.state.isAllSubjects, true);
      let { subjects } = this.state;
      countSubjectBricks(subjects, bricks);
      subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
      this.setState({ ...this.state, bricks, isLoading: false, finalBricks, shown: true });
    } else {
      this.setState({ ...this.state, isLoading: false, failedRequest: true });
    }
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
      let { subjects } = this.state;
      countSubjectBricks(subjects, bs);
      subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
      if (values && values.isViewAll) {
        this.checkSubjectsWithBricks(subjects);
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
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen().then(() => {
          this.moveToPlay(brickId);
        });
      } else {
        this.moveToPlay(brickId);
      }
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

  filter(bricks: Brick[], isAllSubjects: boolean, isCore: boolean, showAll?: boolean) {
    if (this.state.isSearching) {
      bricks = filterSearchBricks(this.state.searchBricks, this.state.isCore);
    }

    let filterSubjects = [];
    if (isAllSubjects) {
      filterSubjects = getCheckedSubjectIds(this.state.subjects);
    } else {
      filterSubjects = prepareUserSubjects(this.state.subjects, this.state.userSubjects);
    }

    if (showAll === true) {
      filterSubjects = this.state.subjects.map(s => s.id);
    }

    bricks = this.filterByCore(bricks, isCore);
    if (!isCore && !this.state.isAdmin) {
      bricks = filterByCurretUser(bricks, this.props.user.id);
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
      this.props.history.push(map.AllSubjects + '?filter=true');
    }

    this.setState({ ...this.state, isViewAll: false, shown: false });
    setTimeout(() => {
      try {
        const finalBricks = this.filter(this.state.bricks, this.state.isAllSubjects, this.state.isCore);
        this.setState({ ...this.state, isClearFilter: this.isFilterClear(), finalBricks, shown: true });
      } catch { }
    }, 1400);
  }

  filterByOneSubject(id: number) {
    this.state.subjects.forEach(s => s.checked = false);
    toggleSubject(this.state.subjects, id);
    toggleSubject(this.state.userSubjects, id);

    const finalBricks = this.filter(this.state.bricks, this.state.isAllSubjects, this.state.isCore);
    this.setState({ ...this.state, isClearFilter: this.isFilterClear(), isViewAll: false, finalBricks, shown: true });
  }

  viewAll() {
    this.checkSubjectsWithBricks(this.state.subjects);
    const finalBricks = this.filter(this.state.bricks, this.state.isAllSubjects, this.state.isCore);
    this.setState({ finalBricks, isViewAll: true });
  }

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

  filterByCore(bricks: Brick[], isCore: boolean) {
    return isCore
      ? bricks.filter(b => b.isCore === true)
      : bricks.filter(b => b.isCore === false);
  }

  searching(searchString: string) {
    if (searchString.length === 0) {
      let finalBricks = this.filterByCore(this.state.bricks, this.state.isCore);
      let filterSubjects = [];
      if (this.state.isAllSubjects) {
        filterSubjects = getCheckedSubjectIds(this.state.subjects);
      } else {
        filterSubjects = prepareUserSubjects(this.state.subjects, this.state.userSubjects);
      }
      finalBricks = sortAndFilterBySubject(finalBricks, filterSubjects);

      this.setState({
        ...this.state,
        searchString,
        finalBricks,
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
    this.setState({ shown: false });
    let bricks: Brick[] | null = [];
    const { pathname } = this.props.location;
    if (pathname.slice(pathname.length - 13, pathname.length) === '/all-subjects') {
      this.props.history.push(map.ViewAllPage + '?searchString=' + searchString);
    }
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
        this.setState({ isLoading: false, failedRequest: true });
      }
    }, 1400);
  }

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
        if (item.brick.adaptedFrom) {
          circleIcon = 'copy';
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

  toggleCore() {
    const isCore = !this.state.isCore;
    this.setState({ isCore, shown: false, sortedIndex: 0 });
    setTimeout(() => {
      try {
        const finalBricks = this.filter(this.state.bricks, this.state.isAllSubjects, isCore);
        this.setState({ shown: true, finalBricks, sortedIndex: 0 });
      } catch { }
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
      if (this.props.user) {
        const { subjects } = this.props.user;
        if (subjects) {
          for (let s of subjects) {
            if (s.id === subjectId) {
              clearProposal();
              this.props.forgetBrick();
              this.props.history.push(map.ProposalBase + '?selectedSubject=' + subjectId);
            } else {
              this.setState({ noSubjectOpen: true, activeSubject: filterSubjects[0] });
            }
          }
        }
      }
    } else {
      this.props.history.push(map.ProposalSubject);
    }
  }

  filterSubjectsByCurrentUser(subjects: SubjectItem[]) {
    let resSubjects = [];
    for (let subject of this.props.user.subjects) {
      for (let s of subjects) {
        if (s.id === subject.id) {
          resSubjects.push(s);
        }
      }
    }
    return resSubjects;
  }

  getPersonalSubjectsWithBricks() {
    let subjects = this.state.subjects.filter(s => s.personalCount && s.personalCount > 0);
    if (!this.state.isAllSubjects) {
      subjects = this.filterSubjectsByCurrentUser(subjects);
    }
    return subjects;
  }

  getPublicSubjectsWithBricks() {
    let subjects = this.state.subjects.filter(s => s.publicCount > 0);
    if (!this.state.isAllSubjects) {
      subjects = this.filterSubjectsByCurrentUser(subjects);
    }
    return subjects;
  }

  getSubjectsWithBricks() {
    let subjects = [];
    if (!this.props.user) {
      subjects = this.state.subjects.filter(s => s.publicCount > 0);
    } else {
      if (this.state.isCore) {
        subjects = this.getPublicSubjectsWithBricks();
      } else {
        subjects = this.getPersonalSubjectsWithBricks();
      }
    }
    return subjects;
  }

  renderNoBricks() {
    const subjects = this.getSubjectsWithBricks();
    return (
      <div className="bricks-list-container desktop-no-bricks">
        <div className="main-brick-container">
          <div className="centered text-theme-dark-blue title no-found">
            Sorry, no bricks found
          </div>
          <CreateOneButton onClick={this.moveToCreateOne.bind(this)} />
          <RecommendButton />
        </div>
        <div className="no-found-help-text">Try one of the following:</div>
        <SubjectsColumn
          subjects={subjects}
          viewAll={this.viewAll.bind(this)}
          onClick={subjectId => this.filterByOneSubject(subjectId)}
        />
      </div>
    );
  }

  renderFirstRow(filterSubjects: number[], bricks: Brick[]) {
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
  }

  renderDesktopBricksPanel(filterSubjects: number[], bricks: Brick[]) {
    if (!this.props.user) {
      if (bricks.length === 0) {
        return this.renderNoBricks();
      }
    }
    if (bricks.length === 0) {
      return this.renderNoBricks();
    }
    return (
      <div className="bricks-list-container bricks-container-mobile">
        {this.renderFirstRow(filterSubjects, bricks)}
        <div className="bricks-list">{this.renderSortedBricks(bricks)}</div>
      </div>
    );
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
        {this.renderDesktopBricksPanel(filterSubjects, bricks)}
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

  renderMobilePage(expandedBrick: Brick | undefined) {
    return (
      <div>
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          placeholder={"Search Subjects, Topics, Titles & more"}
          history={this.props.history}
          search={() => this.search()}
          searching={(v) => this.searching(v)}
        />
        <div className="mobile-scroll-bricks">
          {this.renderMobileUpperBricks(expandedBrick)}
        </div>
        <Grid container direction="row" className="sorted-row">
          <ViewAllMobile
            sortedIndex={this.state.sortedIndex}
            pageSize={this.state.pageSize}
            finalBricks={this.state.finalBricks}
            history={this.props.history}
            handleMobileClick={this.handleMobileClick.bind(this)}
            move={this.move.bind(this)}
          />
        </Grid>
      </div>
    );
  }

  renderDesktopViewAllPage(bricks: Brick[]) {
    return (
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
            this.setState({ isAllSubjects, finalBricks, sortedIndex: 0 });
          }}
          handleSortChange={e => this.handleSortChange(e)}
          clearSubjects={() => this.clearSubjects()}
          filterBySubject={id => this.filterBySubject(id)}
        />
        {this.renderDesktopBricksColumn(bricks)}
      </Grid>
    );
  }

  renderAllSubjectsPage() {
    return <AllSubjects
      user={this.props.user}
      history={this.props.history} location={this.props.location}
      filterByOneSubject={this.filterByOneSubject.bind(this)}
      checkSubjectsWithBricks={() => this.checkSubjectsWithBricks(this.state.subjects)}
    />
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
      <React.Suspense fallback={<></>}>
        {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
        <div className={pageClass}>
          <Hidden only={["sm", "md", "lg", "xl"]}>
            <Switch>
              <Route exec path={map.AllSubjects}>
                {this.renderAllSubjectsPage()}
              </Route>
              <Route exec path={map.ViewAllPage}>
                <MobileCategory history={this.props.history} location={this.props.location}/>
              </Route>
            </Switch>
          </Hidden>
          <Hidden only={["xs"]}>
            <PageHeadWithMenu
              page={PageEnum.ViewAll}
              user={this.props.user}
              placeholder={"Search Subjects, Topics, Titles & more"}
              history={this.props.history}
              search={() => this.search()}
              searching={(v) => this.searching(v)}
            />
            <Switch>
              <Route exec path={map.AllSubjects}>
                {this.renderAllSubjectsPage()}
              </Route>
              <Route exec path={map.ViewAllPage}>
                {this.renderDesktopViewAllPage(bricks)}
              </Route>
            </Switch>
          </Hidden>
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
            close={() => this.setState({ noSubjectOpen: false })}
          />
        </div >
      </React.Suspense>
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
