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
  Brick,
} from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import {
  getPublishedBricksByPage,
  searchPaginateBricks,
} from "services/axios/brick";

import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import ViewAllFilter from "./components/ViewAllFilter";
import ViewAllPagination from "./ViewAllPagination";
import BrickBlock16x9 from "./components/BrickBlock16x9";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { downKeyPressed, upKeyPressed } from "components/services/key";
import map from "components/map";
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
import ShareWithTeachersDialog from "./components/ShareWithTeachersDialog";
import PersonalBrickInvitationDialog from "components/baseComponents/classInvitationDialog/PersonalBrickInvitationDialog";

interface ViewAllProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
  getUser(): Promise<any>;
  forgetBrick(): Promise<any>;
}

interface ViewAllState {
  selectedBricks: Brick[];

  bricks: Array<Brick>;
  searchBricks: Array<Brick>;
  searchString: string;
  searchTyping: boolean;
  isSearching: boolean;
  isSharing: boolean;

  isLoading: boolean;

  dropdownShown: boolean;

  handleKey(e: any): void;

  failedRequest: boolean;
  pageSize: number;
  shown: boolean;
  isSearchBLoading: boolean;

  bricksCount: number;
  page: number;

  // rezise and apect ratio based on those show 3, 2 or 1 column
  aspectRatio: number;
  resize(e: any): void;

  bricksRef: React.RefObject<any>;
  onBricksWheel(e: any): void;
}

const TabletTheme = React.lazy(() => import("./themes/ViewAllPageTabletTheme"));
const DesktopTheme = React.lazy(
  () => import("./themes/ViewAllPageDesktopTheme")
);

class SharePersonalBricks extends Component<ViewAllProps, ViewAllState> {
  constructor(props: ViewAllProps) {
    super(props);

    const values = queryString.parse(props.location.search);

    const searchString = (values.searchString as string) || "";

    this.state = {
      bricks: [],
      bricksCount: 0,
      page: 0,

      isSharing: false,

      selectedBricks: [],

      dropdownShown: false,
      searchBricks: [],
      searchString,
      searchTyping: false,
      isSearching: false,
      pageSize: this.getPageSize(),
      isLoading: true,
      aspectRatio: this.getAspectRatio(),

      failedRequest: false,
      shown: false,
      isSearchBLoading: false,

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
      this.loadBricks();
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  async loadBricks() {
    if (this.props.user) {
      const pageBricks = await getPublishedBricksByPage(
        this.state.pageSize, this.state.page, false,
        [], [], [], false
      );
      if (pageBricks) {
        this.setState({
          ...this.state,
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
  ) {
    const pageBricks = await getPublishedBricksByPage(this.state.pageSize, page, false, [], [], [], false);

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
        this.loadAndSetSearchBricks(this.state.searchString, this.state.page - 1, this.state.pageSize);
        this.setState({ selectedBricks: [] });
      } else {
        this.loadAndSetBricks(this.state.page - 1);
        this.setState({ selectedBricks: [] });
      }
    }
  }

  moveAllNext() {
    let index = this.state.page * this.state.pageSize;
    const { pageSize, bricksCount } = this.state;

    if (index + pageSize <= bricksCount - 1) {
      if (this.state.isSearching) {
        this.loadAndSetSearchBricks(this.state.searchString, this.state.page + 1, this.state.pageSize);
        this.setState({ selectedBricks: [] });
      } else {
        this.loadAndSetBricks(this.state.page + 1);
        this.setState({ selectedBricks: [] });
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

  async loadAndSetSearchBricks(searchString: string, page: number, pageSize: number) {
    let pageBricks = await searchPaginateBricks(searchString, page, pageSize, false);

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
        this.loadAndSetSearchBricks(searchString, 0, this.state.pageSize);
      } catch {
        this.setState({ isLoading: false, isSearchBLoading: false, failedRequest: true });
      }
    }, 1400);
  }

  share() {
    this.setState({ isSharing: true });
  }

  renderSortedBricks() {
    const data = prepareVisibleBricks2(this.state.bricks);
    return data.map((item) => {
      let searchString = "";
      if (this.state.isSearching) {
        searchString = this.state.searchString;
      }

      return (
        <BrickBlock16x9
          brick={item.brick}
          index={item.index}
          row={item.row + 1}
          user={this.props.user}
          key={item.index}
          searchString={searchString}
          shown={this.state.shown}
          history={this.props.history}
          toggle={(b) => {
            b.selected = !b.selected;

            try {
              if (b.selected) {
                const selectedBricks = [...this.state.selectedBricks, b];
                console.log('select brick', selectedBricks)
                this.setState({ selectedBricks });
              } else {
                const selectedBricks = this.state.selectedBricks.filter(br => br.id !== b.id);
                console.log('unselect brick', selectedBricks)
                this.setState({ selectedBricks });
              }
            } catch {
              console.log('can`t toggle brick');
            }
          }}
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
        <div className="categories-absolute">
          <div onClick={() => this.props.history.push(map.ViewAllPageB)}>
            <div>
              <SpriteIcon name="arrow-left" />
            </div>
            <div className="category">Back to Catalogue</div>
          </div>
        </div>
        <ViewAllFilter selectedCount={this.state.selectedBricks.length} share={this.share.bind(this)} />
        <Grid item xs={9} className="brick-row-container">
          {this.renderDesktopBricks()}
        </Grid>
        <ShareWithTeachersDialog
          isOpen={this.state.isSharing}
          selectedBricks={this.state.selectedBricks}
          submit={() => {
            this.state.selectedBricks.forEach(b => b.selected = false);
            this.setState({ selectedBricks: [], isSharing: false });
          }}
          close={() => {
            this.setState({ isSharing: false });
          }}
        />
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

    let className = 'main-listing dashboard-page share-personal-bricks';
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
          {this.state.failedRequest &&
            <FailedRequestDialog
              isOpen={this.state.failedRequest}
              close={() => this.setState({ ...this.state, failedRequest: false })}
            />}
        </div>
        <ClassInvitationDialog />
        <PersonalBrickInvitationDialog />
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

