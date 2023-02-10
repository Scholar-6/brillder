import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from "query-string";
import { Redirect } from "react-router-dom";
import { isMobile } from "react-device-detect";

import brickActions from "redux/actions/brickActions";
import userActions from "../../redux/actions/user";
import { User } from "model/user";
import { Notification } from "model/notifications";
import {
  AcademicLevel,
  Brick,
  BrickLengthEnum,
  KeyWord,
  Subject,
  SubjectItem,
} from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import {
  checkAdmin,
  getAssignmentIcon,
} from "components/services/brickService";
import {
  getPublishedBricksByPage,
  searchPaginateBricks,
} from "services/axios/brick";

import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import ViewAllFilter, { SortBy } from "./components/ViewAllFilter";
import ViewAllPagination from "./ViewAllPagination";
import BrickBlock16x9 from "./components/BrickBlock16x9";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { downKeyPressed, upKeyPressed } from "components/services/key";
import map from "components/map";
import NoSubjectDialog from "components/baseComponents/dialogs/NoSubjectDialog";
import RecommendButton from "components/viewAllPage/components/RecommendBuilderButton";

import {
  prepareVisibleBricks2,
  renderTitle,
} from "./service/viewAll";
import { isPhone } from "services/phone";
import PageLoaderBlue from "components/baseComponents/loaders/pageLoaderBlue";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ViewAllProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
  getUser(): Promise<any>;
  forgetBrick(): Promise<any>;
}

interface ViewAllState {
  bricks: Array<Brick>;
  searchBricks: Array<Brick>;
  searchString: string;
  searchTyping: boolean;
  isSearching: boolean;
  sortBy: SortBy;
  keywords: KeyWord[];

  filterCompetition: boolean;
  filterLevels: AcademicLevel[];
  filterLength: BrickLengthEnum[];
  subjects: SubjectItem[];
  userSubjects: Subject[];

  isLoading: boolean;

  isSubjectPopupOpen: boolean;
  noSubjectOpen: boolean;
  activeSubject: SubjectItem;
  dropdownShown: boolean;

  handleKey(e: any): void;

  isNewTeacher: boolean;

  isClearFilter: any;
  failedRequest: boolean;
  pageSize: number;
  isAdmin: boolean;
  isCore: boolean;
  shown: boolean;
  isSearchBLoading: boolean;
  userIdSearch: number;

  bricksCount: number;
  page: number;

  // rezise and apect ratio based on those show 3, 2 or 1 column
  aspectRatio: number;
  resize(e: any): void;

  bricksRef: React.RefObject<any>;
  onBricksWheel(e: any): void;
}

const MobileTheme = React.lazy(() => import("./themes/ViewAllPageMobileTheme"));
const TabletTheme = React.lazy(() => import("./themes/ViewAllPageTabletTheme"));
const DesktopTheme = React.lazy(
  () => import("./themes/ViewAllPageDesktopTheme")
);

class SharePersonalBricks extends Component<ViewAllProps, ViewAllState> {
  constructor(props: ViewAllProps) {
    super(props);

    let isAdmin = false;
    if (props.user) {
      isAdmin = checkAdmin(props.user.roles);
    }

    const values = queryString.parse(props.location.search);

    const searchString = (values.searchString as string) || "";

    let userIdSearch = -1;
    if (values.searchUserId) {
      userIdSearch = parseInt(values.searchUserId as string);
    }

    this.state = {
      bricks: [],
      sortBy: SortBy.Date,
      subjects: [],
      userSubjects: props.user ? Object.assign([], props.user.subjects) : [],
      bricksCount: 0,
      page: 0,

      isSubjectPopupOpen: false,
      noSubjectOpen: false,
      dropdownShown: false,
      searchBricks: [],
      searchString,
      searchTyping: false,
      activeSubject: {} as SubjectItem,
      isSearching: false,
      pageSize: this.getPageSize(),
      isLoading: true,
      aspectRatio: this.getAspectRatio(),

      isNewTeacher: !!values.newTeacher,

      filterCompetition: false,
      filterLevels: [],
      filterLength: [],
      keywords: [],
      isClearFilter: false,
      failedRequest: false,
      isAdmin,
      isCore: false,
      shown: false,
      isSearchBLoading: false,
      userIdSearch,
      handleKey: this.handleKey.bind(this),
      resize: this.resize.bind(this),

      bricksRef: React.createRef<any>(),
      onBricksWheel: this.onBricksWheel.bind(this),
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
    this.addWheelListener();
  }

  onBricksWheel(e: any) {
    if (e.wheelDeltaY < 0) {
      this.moveAllNext();
    } else {
      this.moveAllBack();
    }
  }

  checkSubjectsWithBricks(subjects: SubjectItem[]) {
    subjects.forEach((s) => {
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

  addWheelListener() {
    const { current } = this.state.bricksRef;
    if (current) {
      current.addEventListener("wheel", this.state.onBricksWheel, false);
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
    window.addEventListener("resize", this.state.resize, false);

    this.addWheelListener();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
    window.removeEventListener("resize", this.state.resize, false);

    const { current } = this.state.bricksRef;
    if (current) {
      current.removeEventListener("wheel", this.state.onBricksWheel, false);
    }
  }

  async handleKey(e: any) {
    if (upKeyPressed(e)) {
      this.moveAllBack();
    } else if (downKeyPressed(e)) {
      this.moveAllNext();
    }
  }

  getAspectRatio() {
    return window.innerWidth / window.innerHeight;
  }

  getPageSize() {
    let pageSize = 6;
    const aspectRatio = this.getAspectRatio();
    if (aspectRatio < 1.5) {
      pageSize = 4;
    }
    if (aspectRatio < 1.05) {
      pageSize = 2;
    }
    return pageSize;
  }

  resize(e: any) {
    this.setState({ pageSize: this.getPageSize(), aspectRatio: this.getAspectRatio() });
  }

  async loadData(values: queryString.ParsedQuery<string>) {
    if (values.searchString) {
      this.search();
    } else if (this.props.user) {
      this.loadBricks(values);
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  async loadBricks(values?: queryString.ParsedQuery<string>) {
    if (this.props.user) {
      let subjectIds: number[] = [];
      const pageBricks = await getPublishedBricksByPage(
        this.state.pageSize, this.state.page, true,
        [], [], subjectIds,
        this.state.filterCompetition, true
      );
      if (pageBricks) {
        let { subjects } = this.state;

        for (let subject of pageBricks.subjects) {
          const filterSubject = subjects.find(s => s.id === subject.id);
          if (filterSubject) {
            filterSubject.personalCount = subject.count;
            filterSubject.publicCount = subject.count;
          }
        }
        if (values) {
          this.checkSubjectsWithBricks(subjects);
        }

        this.setState({
          ...this.state,
          subjects,
          bricksCount: pageBricks.pageCount,
          bricks: pageBricks.bricks,
          isLoading: false,
          shown: true,
        });
      } else {
        this.setState({ ...this.state, isLoading: false, failedRequest: true });
      }
    } else {
      this.setState({ isLoading: false });
    }
  }

  async loadAndSetBricks(
    page: number,
    isCore: boolean,
    levels: AcademicLevel[],
    length: BrickLengthEnum[],
    filterCompetition: boolean,
  ) {
    const pageBricks = await getPublishedBricksByPage(this.state.pageSize, page, false, levels, length, [], filterCompetition, true);

    if (pageBricks) {

      this.setState({
        ...this.state,
        page,
        bricksCount: pageBricks.pageCount,
        bricks: pageBricks.bricks,
        isLoading: false,
        isSearching: false,
        shown: true
      });
    }
  }

  moveAllBack() {
    let index = this.state.page * this.state.pageSize;

    if (index >= this.state.pageSize) {
      if (this.state.isSearching) {
        this.loadAndSetSearchBricks(this.state.searchString, this.state.page - 1, this.state.pageSize, this.state.isCore);
      } else {
        this.loadAndSetBricks(this.state.page - 1, this.state.isCore, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition);
      }
    }
  }

  moveAllNext() {
    let index = this.state.page * this.state.pageSize;
    const { pageSize, bricksCount } = this.state;

    if (index + pageSize <= bricksCount - 1) {
      if (this.state.isSearching) {
        this.loadAndSetSearchBricks(this.state.searchString, this.state.page + 1, this.state.pageSize, this.state.isCore);
      } else {
        this.loadAndSetBricks(this.state.page + 1, this.state.isCore, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition);
      }
    }
  }

  searching(searchString: string) {
    if (searchString.length === 0) {

      this.setState({
        ...this.state,
        searchString,
        searchTyping: false,
        isSearching: false,
      });
    } else {
      this.setState({ ...this.state, searchTyping: true, searchString });
    }
  }

  async loadAndSetSearchBricks(searchString: string, page: number, pageSize: number, isCore: boolean) {
    let pageBricks = await searchPaginateBricks(searchString, page, pageSize, isCore);

    if (pageBricks && pageBricks.bricks.length >= 0) {
      this.setState({
        ...this.state,
        page,
        bricks: pageBricks.bricks,
        bricksCount: pageBricks.pageCount,
        searchBricks: pageBricks.bricks,
        shown: true,
        isLoading: false,
        isSearchBLoading: false,
        isSearching: true,
      });
    } else {
      this.setState({
        ...this.state,
        isLoading: false,
        isSearchBLoading: false,
        failedRequest: true,
      });
    }
  }

  async search() {
    const { searchString } = this.state;
    this.setState({ shown: false, searchTyping: false, isSearchBLoading: true });

    setTimeout(() => {
      try {
        this.loadAndSetSearchBricks(searchString, 0, this.state.pageSize, false);
      } catch {
        this.setState({ isLoading: false, isSearchBLoading: false, failedRequest: true });
      }
    }, 1400);
  }

  renderSortedBricks() {
    const data = prepareVisibleBricks2(this.state.bricks);
    return data.map((item) => {
      let circleIcon = "";
      if (this.props.user) {
        circleIcon = getAssignmentIcon(item.brick);
        if (item.brick.editor?.id === this.props.user.id) {
          circleIcon = "award";
        }
        if (item.brick.adaptedFrom) {
          circleIcon = "copy";
        }
      }

      let searchString = "";
      if (this.state.isSearching) {
        searchString = this.state.searchString;
      }

      return (
        <BrickBlock16x9
          isViewAll={true}
          brick={item.brick}
          index={item.index}
          row={item.row + 1}
          user={this.props.user}
          key={item.index}
          searchString={searchString}
          shown={this.state.shown}
          history={this.props.history}
          circleIcon={circleIcon}
          isPlay={true}
        />
      );
    });
  }

  renderNoBricks() {
    return (
      <div className="bricks-list-container desktop-no-bricks">
        <div className="main-brick-container">
          <div className="centered text-theme-dark-blue title no-found">
            Sorry, no bricks found
          </div>
          <RecommendButton />
        </div>
      </div>
    );
  }

  renderFirstRow(bricks: Brick[]) {
    if (bricks.length > 0) {
      return (
        <div className="main-brick-container">
          <div className="centered text-theme-dark-blue title found">
            {renderTitle(this.state.bricksCount)}
          </div>
        </div>
      );
    }
    return "";
  }

  renderDesktopBricksPanel(bricks: Brick[]) {
    if (bricks.length === 0) {
      return this.renderNoBricks();
    }

    let className = 'bricks-list';
    if (this.state.pageSize === 4) {
      className += ' two-columns-t34';
    } else if (this.state.pageSize === 2) {
      className += ' one-column-t34';
    }

    return (
      <div
        className="bricks-list-container bricks-container-mobile"
        ref={this.state.bricksRef}
      >
        {this.renderFirstRow(bricks)}
        {this.state.isSearchBLoading && <div className="ffef-loader-container"> <PageLoaderBlue content="" /></div>}
        <div className={className}>{this.renderSortedBricks()}</div>
      </div>
    );
  }

  renderDesktopBricks() {
    return (
      <div>
        <div className="brick-row-title main-title">
          Share Personal Bricks
        </div>
        {this.renderDesktopBricksPanel(this.state.bricks)}
        <ViewAllPagination
          pageSize={this.state.pageSize}
          sortedIndex={this.state.page * this.state.pageSize}
          bricksLength={this.state.bricksCount}
          moveAllNext={() => this.moveAllNext()}
          moveAllBack={() => this.moveAllBack()}
        />
      </div>
    );
  }


  renderDesktopViewAllPage() {
    return (
      <Grid container direction="row" className="sorted-row no-mobile-css">
        {!this.props.user && <div className="categories-absolute">
          <div>
            <div className="category" onClick={() => {
              this.props.history.push(map.SubjectCategories);
            }}>Categories</div>
            <div>
              <SpriteIcon name="arrow-right" />
            </div>
          </div>
        </div>}
        <ViewAllFilter />
        <Grid item xs={9} className="brick-row-container">
          {this.renderDesktopBricks()}
        </Grid>
      </Grid>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <PageLoader content="...Getting Bricks..." />;
    }

    const { user, history } = this.props;

    if (isPhone()) {
      return <Redirect to="/home" />;
    }

    let className = 'main-listing dashboard-page';
    if (this.state.pageSize === 4) {
      className += ' two-columns-inside';
    } else if (this.state.pageSize === 2) {
      className += ' one-column-inside';
    }

    return (
      <React.Suspense fallback={<></>}>
        {isMobile ? <TabletTheme /> : <DesktopTheme />}
        <div className={className}>
          <div>
            <PageHeadWithMenu
              page={PageEnum.ViewAll}
              user={user}
              placeholder="Search Titles"
              history={history}
              search={() => this.search()}
              searching={this.searching.bind(this)}
            />
            {this.renderDesktopViewAllPage()}
          </div>
          <FailedRequestDialog
            isOpen={this.state.failedRequest}
            close={() => this.setState({ ...this.state, failedRequest: false })}
          />
          <NoSubjectDialog
            isOpen={this.state.noSubjectOpen}
            subject={this.state.activeSubject}
            history={history}
            close={() => this.setState({ noSubjectOpen: false })}
          />
        </div>
        <ClassInvitationDialog />
        <ClassTInvitationDialog />
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications,
});

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
});

export default connect(mapState, mapDispatch)(SharePersonalBricks);

