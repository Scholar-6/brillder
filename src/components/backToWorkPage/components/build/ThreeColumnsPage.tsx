import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import './BuildPage.scss';
import { Brick, BrickStatus, Subject } from "model/brick";
import { User } from "model/user";
import { checkAdmin, checkTeacher, checkEditor } from "components/services/brickService";
import { ThreeColumns, Filters } from '../../model';
import { getBricksByStatusPerPage, searchCoreBricksByStatus } from "services/axios/brick";
import { Notification } from 'model/notifications';
import { getLongestColumn } from '../../threeColumnService';
import { downKeyPressed, upKeyPressed } from "components/services/key";

import Tab from './Tab';
import ThreeColumnsBuildBricks from './ThreeColumnsBuildBricks';
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import BackPagePaginationV2 from '../BackPagePaginationV2';
import map from "components/map";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { SubjectItem } from "../personalBuild/model";
import { isPhone } from "services/phone";
import ThreeColumnsFilterSidebar from "./ThreeColumnsFilterSidebar";
import subjectActions from "redux/actions/subject";

interface BuildProps {
  searchString: string;
  isSearching: boolean;
  searchDataLoaded: boolean;

  personalDraftCount: number;
  personalPublishCount: number;
  publishedCount: number;

  user: User;
  history: any;
  location: any;

  // redux
  notifications: Notification[] | null;
  searchFinished(): void;
  filters: Filters;
  filterUpdated(filters: Filters): void;
  requestFailed(e: string): void;

  subjects: Subject[];
  getSubjects(): Promise<Subject[]>;
}

interface BuildState {
  rawBricks: Brick[]; // loaded bricks
  threeColumns: any;
  searchBricks: Brick[]; // searching bricks
  searchThreeColumns: any;

  page: number;

  isTeach: boolean;
  isAdmin: boolean;
  isEditor: boolean;

  shown: boolean;
  sortedIndex: number;
  pageSize: number;

  deleteDialogOpen: boolean;
  deleteBrickId: number;

  buildCheckedSubjectId: number;

  bricksLoaded: boolean;
  handleKey(e: any): void;
}

class ThreeColumnsPage extends Component<BuildProps, BuildState> {
  constructor(props: BuildProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user);
    const isAdmin = checkAdmin(this.props.user.roles);
    const isEditor = checkEditor(this.props.user.roles)

    let threeColumns = {
      red: {
        finalBricks: [],
        count: 0
      },
      yellow: {
        finalBricks: [],
        count: 0
      },
      green: {
        finalBricks: [],
        count: 0
      }
    } as any;

    this.state = {
      rawBricks: [],
      threeColumns,
      searchBricks: [],
      searchThreeColumns: threeColumns,

      page: 0,

      isAdmin,
      isTeach,
      isEditor,

      shown: true,
      pageSize: 5,

      sortedIndex: 0,
      deleteDialogOpen: false,
      deleteBrickId: -1,

      bricksLoaded: false,

      buildCheckedSubjectId: - 1,

      handleKey: this.handleKey.bind(this)
    }

    this.getInitData();
  }

  // load bricks when notification come
  componentDidUpdate(prevProps: BuildProps) {
    const { notifications } = this.props;
    const oldNotifications = prevProps.notifications;
    if (notifications && oldNotifications) {
      if (notifications.length > oldNotifications.length) {
        this.getBricks(this.state.page, this.state.buildCheckedSubjectId);
      }
    }
  }

  async getInitData() {
    if (this.props.subjects.length === 0) {
      await this.props.getSubjects();
    }
    await this.getBricks(0, -1);
  }

  async searchBricksV2(page: number, brickStatus: BrickStatus, searchString: string) {
    return searchCoreBricksByStatus({
      searchString,
      page,
      pageSize: this.state.pageSize,
      isCore: true,
      brickStatuses: [brickStatus]
    });
  }

  async getSearchBricks(page: number, searchString: string) {
    const draftData = await this.searchBricksV2(page, BrickStatus.Draft, searchString);
    const buildData = await this.searchBricksV2(page, BrickStatus.Build, searchString);
    const reviewData = await this.searchBricksV2(page, BrickStatus.Review, searchString);

    let threeColumns = {
      red: { finalBricks: draftData?.bricks, count: draftData?.count || 0 },
      yellow: { finalBricks: buildData?.bricks, count: buildData?.count || 0 },
      green: { finalBricks: reviewData?.bricks, count: reviewData?.count || 0 }
    } as any;

    this.setState({
      ...this.state, page, searchThreeColumns: threeColumns,
      bricksLoaded: true, buildCheckedSubjectId: -1
    });
  }

  componentWillReceiveProps(nextProps: BuildProps) {
    if (nextProps.isSearching && nextProps.searchDataLoaded === false) {
      this.getSearchBricks(0, nextProps.searchString);
    }
  }

  async getBrickByStatus(page: number, brickStatus: BrickStatus, subjectId: number, skipOne: boolean) {
    let subjectIds: number[] = [];
    if (subjectId && subjectId >= 0) {
      subjectIds = [subjectId];
    }
    return await getBricksByStatusPerPage({
      page,
      pageSize: this.state.pageSize,
      isCore: true,
      subjectIds,
      brickStatuses: [brickStatus],
      skipOne
    });
  }

  async getBricks(page: number, subjectId: number) {
    if (this.props.isSearching) {
      this.getSearchBricks(page, this.props.searchString);
      return;
    }
    
    const draftData = await this.getBrickByStatus(page, BrickStatus.Draft, subjectId, true);
    const buildData = await this.getBrickByStatus(page, BrickStatus.Build, subjectId, false);
    const reviewData = await this.getBrickByStatus(page, BrickStatus.Review, subjectId, false);

    let threeColumns = {
      red: { finalBricks: draftData?.bricks, count: draftData?.count },
      yellow: { finalBricks: buildData?.bricks, count: buildData?.count },
      green: { finalBricks: reviewData?.bricks, count: reviewData?.count }
    } as any;

    this.setState({ ...this.state, page, threeColumns, bricksLoaded: true, buildCheckedSubjectId: subjectId });
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  moveBack() {
    if (this.state.page > 0) {
      this.getBricks(this.state.page - 1, this.state.buildCheckedSubjectId)
    }
  }

  moveNext() {
    this.getBricks(this.state.page + 1, this.state.buildCheckedSubjectId);
  }

  handleKey(e: any) {
    if (upKeyPressed(e)) {
      this.moveBack();
    } else if (downKeyPressed(e)) {
      this.moveNext();
    }
  }

  switchPublish() {
    this.props.history.push(map.BackToWorkPagePublished);
  }

  filterUpdated(newFilters: Filters) {
    this.props.filterUpdated(newFilters);
  }

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({ ...this.state, deleteDialogOpen: true, deleteBrickId });
  }

  handleDeleteClose() {
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  async delete() {
    this.getBricks(this.state.page, this.state.buildCheckedSubjectId);
    this.setState({ deleteDialogOpen: false, deleteBrickId: -1 })
  }

  renderPagination = (threeColumns: ThreeColumns) => {
    let { page, pageSize } = this.state;

    const longestColumn = getLongestColumn(threeColumns);

    return (
      <BackPagePaginationV2
        sortedIndex={page * pageSize}
        pageSize={pageSize}
        isRed={page === 0}
        longestColumn={longestColumn}
        moveNext={() => this.moveNext()}
        moveBack={() => this.moveBack()}
      />
    )
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
    if (s) {
      this.getBricks(0, s.id);
    } else {
      if (this.state.buildCheckedSubjectId !== -1) {
        this.getBricks(0, -1);
      }
    }
  }

  render() {
    const { history } = this.props;
    if (isPhone()) {
      history.push(map.backToWorkUserBased(this.props.user));
      return <PageLoader content="" />;
    }

    let { threeColumns } = this.state;
    if (this.props.isSearching) {
      threeColumns = this.state.searchThreeColumns;
    }

    let isEmpty = false;

    if (threeColumns.red.count === 0 && threeColumns.green.count === 0 && threeColumns.yellow.count === 0 && this.state.buildCheckedSubjectId === -1) {
      isEmpty = true;
    }

    return (
      <Grid container direction="row" className="sorted-row build-page-content">
        <ThreeColumnsFilterSidebar
          user={this.props.user}
          history={this.props.history}
          threeColumns={threeColumns}
          filters={this.props.filters}
          isEmpty={isEmpty}
          subjects={this.props.subjects}
          filterChanged={this.filterUpdated.bind(this)}
          filterBySubject={this.filterBuildBySubject.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <Tab
            draft={this.props.personalDraftCount}
            selfPublish={this.props.personalPublishCount}
            onCoreSwitch={() => {
              this.props.history.push(map.BackToWorkPagePersonal);
            }}
          />
          <div className="tab-content">
            <ThreeColumnsBuildBricks
              user={this.props.user}
              threeColumns={threeColumns}
              publishedCount={this.props.publishedCount}
              shown={this.state.shown}
              page={this.state.page}
              pageSize={this.state.pageSize}
              history={history}
              filters={this.props.filters}
              loaded={this.state.bricksLoaded}
              searchString={this.props.searchString}
              isCorePage={true}
              moveNext={this.moveNext.bind(this)}
              moveBack={this.moveBack.bind(this)}
              switchPublish={this.switchPublish.bind(this)}
              handleDeleteOpen={this.handleDeleteOpen.bind(this)}
            />
            {this.renderPagination(threeColumns)}
          </div>
        </Grid>
        <DeleteBrickDialog
          isOpen={this.state.deleteDialogOpen}
          brickId={this.state.deleteBrickId}
          onDelete={() => this.delete()}
          close={() => this.handleDeleteClose()}
        />
      </Grid>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications,
  subjects: state.subjects.subjects,
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
  getSubjects: () => dispatch(subjectActions.fetchSubjects()),
});

export default connect(mapState, mapDispatch)(ThreeColumnsPage);
