import React, { Component } from "react";
import { Box, Grid, Hidden } from "@material-ui/core";
import { Category } from "./interface";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import queryString from 'query-string';
import "swiper/swiper.scss";

import "./ViewAll.scss";
import brickActions from "redux/actions/brickActions";
import { User } from "model/user";
import { Notification } from 'model/notifications';
import { Brick, BrickStatus, Subject, SubjectItem } from "model/brick";
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
  totalSubjects: Subject[];
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

    this.state = {
      yourBricks: [],
      bricks: [],
      sortBy: SortBy.Date,
      subjects: [],
      totalSubjects: [],
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
      this.loadBricks();
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
      subjects.sort((s1, s2) => s1.name.localeCompare(s2.name));
      subjects.forEach(s => {
        if (values.subjectId) {
          if (s.id === parseInt(values.subjectId as string || '')) {
            s.checked = true;
          }
        }
      });
      this.setState({ ...this.state, subjects, totalSubjects: subjects });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }
    return subjects;
  }

  async loadBricks() {
    const currentBricks = await getCurrentUserBricks();
    if (currentBricks) {
      let yourBricks = currentBricks.filter(brick => brick.status === BrickStatus.Publish);
      yourBricks = yourBricks.sort((a, b) => (new Date(b.updated).getTime() < new Date(a.updated).getTime()) ? -1 : 1);
      this.setState({ ...this.state, yourBricks });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }

    const bricks = await getPublishedBricks();
    if (bricks) {
      let bs = bricks.sort((a, b) => (new Date(b.updated).getTime() < new Date(a.updated).getTime()) ? -1 : 1);
      bs = bs.sort((a, b) => (b.hasNotifications === true && new Date(b.updated).getTime() > new Date(a.updated).getTime()) ? -1 : 1);
      const finalBricks = this.filter(bs, this.state.isCore);
      let {subjects} = this.state;
      this.countSubjectBricks(subjects, bs);
      subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
      this.setState({ ...this.state, subjects, bricks, isLoading: false, finalBricks, shown: true });
    } else {
      this.setState({ ...this.state, isLoading: false, failedRequest: true });
    }
  }

  countSubjectBricks(subjects: any[], bricks: Brick[]) {
    subjects.forEach((s:any) => {
      s.publicCount = 0;
      s.personalCount = 0;
    });
    for (let b of bricks) {
      for (let s of subjects) {
        if (s.id === b.subjectId) {
          if (b.isCore) {
            s.publicCount += 1;
          } else {
            s.personalCount += 1;
          }
        }
      }
    }
  }

  delete(brickId: number) {
    function removeByIndex(bricks: Brick[], brickId: number) {
      let brick = bricks.find(brick => brick.id === brickId);
      if (brick) {
        let index = bricks.indexOf(brick);
        bricks.splice(index, 1);
      }
    }

    removeByIndex(this.state.bricks, brickId);
    removeByIndex(this.state.finalBricks, brickId);
    removeByIndex(this.state.searchBricks, brickId);
    this.setState({ ...this.state, deleteDialogOpen: false });
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

  handleSortChange = (e: any) => {
    const { state } = this;
    const sortBy = parseInt(e.target.value) as SortBy;
    let { finalBricks } = this.state;
    if (sortBy === SortBy.Date) {
      finalBricks = finalBricks.sort((a, b) => {
        const createdA = new Date(a.created).getTime();
        const createdB = new Date(b.created).getTime();
        return createdA < createdB ? 1 : -1;
      });
    } else if (sortBy === SortBy.Popularity) {
      finalBricks = finalBricks.sort((a, b) =>
        a.attemptsCount > b.attemptsCount ? 1 : -1
      );
    }
    this.setState({ ...state, finalBricks, sortBy });
  };

  getCheckedSubjectIds() {
    const filterSubjects = [];
    const { state } = this;
    const { subjects } = state;
    for (let subject of subjects) {
      if (subject.checked) {
        filterSubjects.push(subject.id);
      }
    }
    return filterSubjects;
  }

  getCheckedSubjects() {
    const filterSubjects = [];
    const { state } = this;
    const { subjects } = state;
    for (let subject of subjects) {
      if (subject.checked) {
        filterSubjects.push(subject);
      }
    }
    return filterSubjects;
  }

  filterByCurretUser(bricks: Brick[]) {
    const userId = this.props.user.id;
    return bricks.filter(b => b.author.id === userId);
  }

  filterSearchBricks() {
    if (this.state.isCore) {
      return this.state.searchBricks.filter(b => b.isCore);
    } else {
      return this.state.searchBricks.filter(b => !b.isCore);
    }
  }

  /**
   * Sort bricks by subjects. Order is based on list of filterSubjectIds
   */
  sortBySubjectId(bricks: Brick[], filterSubjectIds: number[]) {
    bricks.sort((a, b) => {
      if (a.subject && b.subject) {
        let res1 = 0;
        let res2 = 0;

        let count = 0;
        for (let subjectId of filterSubjectIds) {
          if (a.subject.id === subjectId) {
            res1 = count;
          }
          if (b.subject.id === subjectId) {
            res2 = count;
          }
          count += 1;
        }
        return res1 - res2;
      }
      return 0;
    });
  }

  filterBySubjects(bricks: Brick[], filterSubjectIds: number[]) {
    let filtered = [];
    for (let brick of bricks) {
      let res = filterSubjectIds.indexOf(brick.subjectId);
      if (res !== -1) {
        filtered.push(brick);
      }
    }
    return filtered;
  }

  filter(bricks: Brick[], isCore?: boolean) {
    if (this.state.isSearching) {
      bricks = this.filterSearchBricks();
    }
    let filtered: Brick[] = [];

    let filterSubjects = this.getCheckedSubjectIds();

    if (isCore) {
      bricks = bricks.filter(b => b.isCore === true);
    } else {
      bricks = bricks.filter(b => !b.isCore)
    }

    if (filterSubjects.length > 0) {
      filtered = this.filterBySubjects(bricks, filterSubjects);
      this.sortBySubjectId(filtered, filterSubjects);
      return filtered;
    }
    return bricks;
  }

  //region Hide / Expand / Clear Filter
  isFilterClear() {
    return this.state.subjects.some(r => r.checked);
  }
  //endregion

  filterBySubject = (id: number) => {
    const { subjects } = this.state;
    const subject = subjects.find(s => s.id === id);
    if (subject) {
      subject.checked = !subject?.checked;
    }
    const finalBricks = this.filter(this.state.bricks, this.state.isCore);
    this.setState({ ...this.state, shown: false });
    setTimeout(() => {
      try {
        this.setState({ ...this.state, isClearFilter: this.isFilterClear(), finalBricks, shown: true });
      } catch {}
    }, 1400);
  };

  clearSubjects = () => {
    const { state } = this;
    const { subjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
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
      bricks = this.filterSearchBricks();
    }

    if (index + pageSize <= bricks.length) {
      this.setState({ ...this.state, sortedIndex: index + this.state.pageSize });
    }
  }

  hideBricks() {
    const { finalBricks, yourBricks } = this.state;
    finalBricks.forEach(b => (b.expanded = false));
    yourBricks.forEach(b => (b.expanded = false));
  }

  yourBricksMouseHover(index: number) {
    let { yourBricks } = this.state;
    this.hideBricks();
    if (yourBricks[index]) {
      yourBricks[index].expanded = true;
    }
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
    if (finalBricks[index]) {
      finalBricks[index].expanded = true;
    }
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
    finalBricks[index].expanded = true;
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
          const finalBricks = this.filter(bricks, this.state.isCore);
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
            className={`absolute-container brick-row-0 ${
              brick.expanded ? "brick-hover" : ""
              }`}
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

  prepareVisibleBricks = (
    sortedIndex: number,
    pageSize: number,
    bricks: Brick[]
  ) => {
    let data: any[] = [];
    let count = 0;
    for (let i = 0 + sortedIndex; i < pageSize + sortedIndex; i++) {
      const brick = bricks[i];
      if (brick) {
        let row = Math.floor(count / 3);
        data.push({ brick, key: i, index: count, row });
        count++;
      }
    }
    return data;
  };

  renderSortedBricks = (bricks: Brick[]) => {
    let data = this.prepareVisibleBricks(
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
        const finalBricks = this.filter(this.state.bricks, isCore);
        this.setState({ shown: true, finalBricks, sortedIndex: 0 });
      } catch {}
    }, 1400);
  }

  renderTitle(bricks: Brick[]) {
    const {length} = bricks;
    if (length === 1) {
      return '1 brick found';
    }
    return length + ' bricks found';
  }

  renderMainTitle(filterSubjects: number[]) {
    if (filterSubjects.length === 1) {
      const subjectId = filterSubjects[0];
      const subject = this.state.subjects.find(s => s.id === subjectId);
      return subject?.name;
    } else if (filterSubjects.length > 1) {
      return "Filtered";
    } else if (this.state.isSearching) {
      return this.state.searchString;
    }
    return "ALL BRICKS";
  }

  moveToCreateOne() {
    const filterSubjects = this.getCheckedSubjects();
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

  renderCreateOneButton() {
    return (
      <div className="create-button" onClick={() => this.moveToCreateOne()}>
        <SpriteIcon name="trowel" />
        Create a new one
      </div>
    );
  }

  renderRecomendButton() {
    return (
      <div className="recomend-button">
        <SpriteIcon name="user-plus"/>
        Recommend a builder
      </div>
    );
  }

  renderNoBricks() {
    return (
      <div className="main-brick-container">
        <div className="centered text-theme-dark-blue title no-found">
          Sorry, no bricks found
        </div>
        {this.renderCreateOneButton()}
        {this.renderRecomendButton()}
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
            {this.renderTitle(bricks)}
            {this.renderCreateOneButton()}
            {this.renderRecomendButton()}
          </div>
        </div>
      );
    }
    return <div className="bricks-list">{this.renderYourBrickRow()}</div>;
  }

  renderDesktopBricks(bricks: Brick[]) {
    const filterSubjects = this.getCheckedSubjectIds();

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
      bricks = this.filterSearchBricks();
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
            isCore={this.state.isCore}
            isClearFilter={this.state.isClearFilter}
            subjectSelected={true}
            handleSortChange={e => this.handleSortChange(e)}
            clearSubjects={() => this.clearSubjects()}
            filterBySubject={index => this.filterBySubject(index)}
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
