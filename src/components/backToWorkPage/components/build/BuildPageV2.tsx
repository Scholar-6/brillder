import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import './BuildPage.scss';
import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { checkAdmin, checkTeacher, checkEditor } from "components/services/brickService";
import { Filters, SortBy } from '../../model';
import { getBackToWorkStatistics, searchBricks, getBricksByStatusPerPage } from "services/axios/brick";
import { Notification } from 'model/notifications';
import {
  filterBricks, hideBricks, expandBrick, expandSearchBrick, removeBrickFromList
} from '../../service';
import { downKeyPressed, upKeyPressed } from "components/services/key";

import Tab from './Tab';
import BuildBricks from './BuildBricks';
import FilterSidebar from './FilterSidebar';
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import BackPagePagination from '../BackPagePagination';
import map from "components/map";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { SubjectItem } from "../personalBuild/model";
import { isPhone } from "services/phone";
import { getSubjects } from "services/axios/subject";


interface BuildProps {
  searchString: string;
  isSearching: boolean;
  searchDataLoaded: boolean;

  user: User;
  history: any;
  location: any;

  filters: Filters;
  filterUpdated(filters: Filters): Filters;

  // redux
  notifications: Notification[] | null;
  searchFinished(): void;
  requestFailed(e: string): void;
}

interface BuildState {
  finalBricks: Brick[]; // bricks to display
  rawBricks: Brick[]; // loaded bricks
  searchBricks: Brick[]; // searching bricks
  count: number;

  isTeach: boolean;
  isAdmin: boolean;
  isEditor: boolean;


  personalDraftCount: number;
  personalPublishCount: number;
  publishedCount: number;

  shown: boolean;
  sortBy: SortBy;
  sortedIndex: number;
  page: number;
  pageSize: number;

  deleteDialogOpen: boolean;
  deleteBrickId: number;

  subjects: SubjectItem[];

  draftCount: number;
  buildCount: number;
  reviewCount: number;

  buildCheckedSubjectId: number;

  bricksLoaded: boolean;
  handleKey(e: any): void;
}

class BuildPage extends Component<BuildProps, BuildState> {
  constructor(props: BuildProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user);
    const isAdmin = checkAdmin(this.props.user.roles);
    const isEditor = checkEditor(this.props.user.roles)

    this.state = {
      finalBricks: [],
      rawBricks: [],
      searchBricks: [],
      count: 0,

      draftCount: 0,
      buildCount: 0,
      reviewCount: 0,

      isAdmin,
      isTeach,
      isEditor,

      page: 0,

      shown: true,
      pageSize: 15,

      sortBy: SortBy.None,
      sortedIndex: 0,
      deleteDialogOpen: false,
      deleteBrickId: -1,

      publishedCount: 0,
      personalDraftCount: 0,
      personalPublishCount: 0,

      bricksLoaded: false,

      buildCheckedSubjectId: - 1,

      subjects: [],
      handleKey: this.handleKey.bind(this)
    }

    this.getInitData();
  }

  async getInitData() {
    await this.setCount();
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({subjects});
    }
    
    await this.getBricks(this.state.page, this.state.buildCheckedSubjectId, this.getStatusesFromFilter(this.props.filters));
  }

  // load bricks when notification come
  componentDidUpdate(prevProps: BuildProps) {
    const { notifications } = this.props;
    const oldNotifications = prevProps.notifications;
    if (notifications && oldNotifications) {
      if (notifications.length > oldNotifications.length) {
        this.getBricks(this.state.page, this.state.buildCheckedSubjectId, this.getStatusesFromFilter(this.props.filters));
      }
    }
  }

  componentWillReceiveProps(nextProps: BuildProps) {
    if (nextProps.isSearching && nextProps.searchDataLoaded === false) {
      this.setState({ searchBricks: [], shown: false, bricksLoaded: false, sortedIndex: 0 });
      searchBricks(nextProps.searchString).then(bricks => {
        if (bricks) {
          setTimeout(() => {
            this.setState({
              ...this.state, searchBricks: bricks, shown: true,
              bricksLoaded: true, sortedIndex: 0,
            });
            this.props.searchFinished();
          }, 1400);
        } else {
          this.props.requestFailed('Can`t get bricks by search');
        }
      });
    }
  }

  async setCount() {
    const bricksCount = await getBackToWorkStatistics(true, true, false);
    if (bricksCount) {
      if (bricksCount.publishedCount != undefined && bricksCount.personalDraftCount != undefined && bricksCount.personalPublishCount != undefined) {
        this.setState({
          personalDraftCount: bricksCount.personalDraftCount,
          personalPublishCount: bricksCount.personalPublishCount,
          publishedCount: bricksCount.publishedCount
        });
      }
    }
  }

  async getBricksPage(page: number, subjectIds: number[], brickStatuses: BrickStatus[]) {
    return await getBricksByStatusPerPage({
      page,
      pageSize: this.state.pageSize,
      isCore: true,
      subjectIds,
      brickStatuses,
    });
  }

  getStatusesFromFilter(filters: Filters) {
    let statuses = [];
    if (filters.draft) {
      statuses.push(BrickStatus.Draft);
    }
    if (filters.build) {
      statuses.push(BrickStatus.Build);
    }
    if (filters.review) {
      statuses.push(BrickStatus.Review);
    }
    return statuses;
  }

  async getBricks(page: number, subjectId: number, statuses: BrickStatus[]) {
    let subjectIds: number[] = [];
    if (subjectId && subjectId >= 0) {
      subjectIds = [subjectId];
    }
    const bricks = await this.getBricksPage(page, subjectIds, statuses);
    if (bricks) {
      let draftCount = 0;
      let buildCount = 0;
      let reviewCount = 0;
      if (statuses.length == 2) {
        let first = statuses[0];
        if (first === BrickStatus.Draft) {
          draftCount = bricks.firstStatusCount;
        } else if (first === BrickStatus.Build) {
          buildCount = bricks.firstStatusCount;
        }
        let secondCount = bricks.count - bricks.firstStatusCount;
        let second = statuses[1];
        if (second === BrickStatus.Build) {
          buildCount = secondCount;
        } else {
          reviewCount = secondCount;
        }
      }
      this.setState({
        ...this.state, page,
        finalBricks: bricks.bricks,
        count: bricks.count,
        draftCount,
        buildCount,
        reviewCount,
        bricksLoaded: true
      });
    } else {
      this.props.requestFailed('Can`t get bricks');
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  moveBack() {
    if (this.state.page >= 1) {
      this.moveAllBack();
    }
  }

  moveNext() {
    this.moveAllNext();
  }

  handleKey(e: any) {
    if (upKeyPressed(e)) {
      this.moveBack();
    } else if (downKeyPressed(e)) {
      this.moveNext();
    }
  }

  filterUpdated(newFilters: Filters) {
    this.props.filterUpdated(newFilters);
    this.getBricks(
      0, this.state.buildCheckedSubjectId,
      this.getStatusesFromFilter(newFilters)
    );
  }

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({ ...this.state, deleteDialogOpen: true, deleteBrickId });
  }

  handleDeleteClose() {
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  handleMouseHover(index: number) {
    let bricks = this.state.finalBricks;
    bricks = bricks.filter(b => b.isCore === true);
    if (this.props.isSearching) {
      bricks = this.state.searchBricks;
      hideBricks(bricks);
    } else {
      hideBricks(this.state.rawBricks);
    }

    if (bricks[index] && bricks[index].expanded) return;

    if (this.props.isSearching) {
      expandSearchBrick(this.state.searchBricks, index);
    } else {
      let bricks2 = this.state.finalBricks.filter(b => b.isCore === true);
      expandBrick(bricks2, this.state.rawBricks, index);
    }
    this.setState({ ...this.state });
  }

  handleMouseLeave() {
    if (this.props.isSearching) {
      hideBricks(this.state.searchBricks);
    } else {
      hideBricks(this.state.rawBricks);
    }
    this.setState({ ...this.state });
  }

  delete(brickId: number) {
    let { rawBricks, finalBricks } = this.state;
    removeBrickFromList(rawBricks, brickId);
    removeBrickFromList(finalBricks, brickId);
    removeBrickFromList(this.state.searchBricks, brickId);
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  moveAllBack() {
    this.getBricks(
      this.state.page - 1, this.state.buildCheckedSubjectId,
      this.getStatusesFromFilter(this.props.filters)
    );
  }

  moveAllNext() {
    this.getBricks(
      this.state.page + 1, this.state.buildCheckedSubjectId,
      this.getStatusesFromFilter(this.props.filters)
    );
  }

  renderPagination = () => {
    let { pageSize } = this.state;

    const sortedIndex = this.state.page * this.state.pageSize;

    return (
      <BackPagePagination
        sortedIndex={sortedIndex}
        pageSize={pageSize}
        isRed={sortedIndex === 0}
        bricksLength={this.state.count}
        moveNext={() => this.moveAllNext()}
        moveBack={() => this.moveAllBack()}
      />
    );
  }

  filterInProgressBySubject(bs: Brick[], s: SubjectItem, filters: Filters) {
    return bs.filter(b => {
      if (b.subjectId === s.id && b.status !== BrickStatus.Publish) {
        if (filters.draft === true && b.status === BrickStatus.Draft) {
          return true;
        } else if (filters.review === true && b.status === BrickStatus.Review) {
          return true;
        } else if (filters.build === true && b.status === BrickStatus.Build) {
          return true;
        }
      }
      return false;
    });
  }

  filterBuildBySubject(s: SubjectItem | null) {
    const statuses = this.getStatusesFromFilter(this.props.filters);
    if (s) {
      this.getBricks(0, s.id, statuses);
    } else {
      if (this.state.buildCheckedSubjectId !== -1) {
        this.getBricks(0, -1, statuses);
      }
    }
  }

  render() {
    const { history } = this.props;
    if (isPhone()) {
      history.push(map.backToWorkUserBased(this.props.user));
      return <PageLoader content="" />;
    }

    let finalBricks = this.state.finalBricks;
    if (this.props.isSearching) {
      finalBricks = this.state.searchBricks;
    }

    const isEmpty = this.state.count === 0;

    return (
      <Grid container direction="row" className="sorted-row build-page-content">
        <FilterSidebar
          user={this.props.user}
          history={this.props.history}
          draftCount={this.state.draftCount}
          buildCount={this.state.buildCount}
          reviewCount={this.state.reviewCount}
          filters={this.props.filters}
          isEmpty={isEmpty}
          subjects={this.state.subjects}
          filterChanged={this.filterUpdated.bind(this)}
          filterBySubject={this.filterBuildBySubject.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <Tab
            draft={this.state.personalDraftCount}
            selfPublish={this.state.personalPublishCount}
            onCoreSwitch={() => {
              this.props.history.push(map.BackToWorkPagePersonal);
            }}
          />
          <div className="tab-content">
            <BuildBricks
              user={this.props.user}
              selectedSubjectId={this.state.buildCheckedSubjectId}
              finalBricks={finalBricks}
              publishedCount={this.state.publishedCount}
              draftCount={this.state.draftCount}
              buildCount={this.state.buildCount}
              reviewCount={this.state.reviewCount}
              shown={this.state.shown}
              pageSize={this.state.pageSize}
              sortedIndex={this.state.sortedIndex}
              history={history}
              filters={this.props.filters}
              loaded={this.state.bricksLoaded}
              searchString={this.props.searchString}
              isCorePage={true}
              moveNext={this.moveNext.bind(this)}
              moveBack={this.moveBack.bind(this)}
              handleDeleteOpen={this.handleDeleteOpen.bind(this)}
              handleMouseHover={this.handleMouseHover.bind(this)}
              handleMouseLeave={this.handleMouseLeave.bind(this)}
            />
            {this.renderPagination()}
          </div>
        </Grid>
        <DeleteBrickDialog
          isOpen={this.state.deleteDialogOpen}
          brickId={this.state.deleteBrickId}
          onDelete={(brickId: number) => this.delete(brickId)}
          close={() => this.handleDeleteClose()}
        />
      </Grid>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(BuildPage);
