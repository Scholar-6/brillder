import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import './BuildPage.scss';
import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { checkAdmin, checkTeacher, checkEditor } from "components/services/brickService";
import { ThreeColumns, Filters } from '../../model';
import { getBricksByStatusPerPage, searchCoreBricksByStatus } from "services/axios/brick";
import { Notification } from 'model/notifications';
import { hideBricks } from '../../service';
import {
  getThreeColumnName, getThreeColumnBrick, expandThreeColumnBrick, getLongestColumn
} from '../../threeColumnService';
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
import { getSubjects } from "services/axios/subject";


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

  subjects: SubjectItem[];

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

      subjects: [],

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
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
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

  async getBrickByStatus(page: number, brickStatus: BrickStatus, subjectId?: number) {
    let subjectIds: number[] = [];
    if (subjectId && subjectId >= 0) {
      subjectIds = [subjectId];
    }
    return await getBricksByStatusPerPage({
      page,
      pageSize: this.state.pageSize,
      isCore: true,
      subjectIds,
      brickStatuses: [brickStatus]
    });
  }

  async getBricks(page: number, subjectId: number) {
    if (this.props.isSearching) {
      this.getSearchBricks(page, this.props.searchString);
      return;
    }
    
    const draftData = await this.getBrickByStatus(page, BrickStatus.Draft, subjectId);
    const buildData = await this.getBrickByStatus(page, BrickStatus.Build, subjectId);
    const reviewData = await this.getBrickByStatus(page, BrickStatus.Review, subjectId);

    let threeColumns = {
      red: { finalBricks: draftData?.bricks, count: draftData?.count },
      yellow: { finalBricks: buildData?.bricks, count: buildData?.count },
      green: { finalBricks: reviewData?.bricks, count: reviewData?.count }
    } as any;

    this.setState({ ...this.state, page, threeColumns, bricksLoaded: true, buildCheckedSubjectId: subjectId });

    /*
    const bricks = [];
    //[...reviewData.bricks, ...draftData.bricks, ...buildData.bricks]; //  await getThreeColumnBricks();
    if (bricks) {
      //let bs = bricks.sort((a, b) => (new Date(b.updated).getTime() < new Date(a.updated).getTime()) ? -1 : 1);
      //bs = bs.sort(b => (b.editors && b.editors.find(e => e.id === this.props.user.id)) ? -1 : 1);
      //bs = bs.sort((a, b) => (b.hasNotifications === true && new Date(b.updated).getTime() > new Date(a.updated).getTime()) ? -1 : 1);
      this.setBricks(bricks);
    } else {
      this.props.requestFailed('Can`t get bricks');
    }*/
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  moveBack() {
    this.getBricks(this.state.page - 1, this.state.buildCheckedSubjectId)
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

  getBrickSubjects(bricks: Brick[]) {
    let subjects: SubjectItem[] = [];
    for (let brick of bricks) {
      if (!brick.subject) {
        continue;
      }
      if (!brick.isCore) {
        continue;
      }
      if (brick.status === BrickStatus.Publish) {
        continue;
      }
      let subject = subjects.find(s => s.id === brick.subject?.id);
      if (!subject) {
        let subject = Object.assign({}, brick.subject) as SubjectItem;
        subject.count = 1;
        subjects.push(subject);
      } else {
        subject.count += 1;
      }
    }
    return subjects;
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

  moveToFirstPage() {
    this.setState({ sortedIndex: 0 });
  }

  onThreeColumnsMouseHover(index: number, status: BrickStatus) {
    let key = Math.floor(index / 3);

    let { threeColumns } = this.state;
    if (this.props.isSearching) {
      threeColumns = this.state.searchThreeColumns;
      hideBricks(this.state.searchBricks);
    } else {
      hideBricks(this.state.rawBricks);
    }
    let name = getThreeColumnName(status);
    let brick = getThreeColumnBrick(threeColumns, name, key);
    if (!brick || brick.expanded) return;
    expandThreeColumnBrick(threeColumns, name, key + this.state.sortedIndex);
    this.setState({ ...this.state });
  }

  onThreeColumnsMouseLeave() {
    if (this.props.isSearching) {
      hideBricks(this.state.searchBricks);
    } else {
      hideBricks(this.state.rawBricks);
    }
    this.setState({ ...this.state });
  }

  async delete() {
    this.getBricks(this.state.page, this.state.buildCheckedSubjectId);
    this.setState({ deleteDialogOpen: false, deleteBrickId: -1 })
  }

  renderPagination = (threeColumns: ThreeColumns) => {
    let { page, pageSize } = this.state;

    const longestColumn = getLongestColumn(threeColumns);

    console.log(page, pageSize, longestColumn);

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

    console.log(threeColumns);

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
          subjects={this.state.subjects}
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
              pageSize={this.state.pageSize}
              sortedIndex={this.state.sortedIndex}
              history={history}
              filters={this.props.filters}
              loaded={this.state.bricksLoaded}
              searchString={this.props.searchString}
              isCorePage={true}
              moveNext={this.moveNext.bind(this)}
              moveBack={this.moveBack.bind(this)}
              switchPublish={this.switchPublish.bind(this)}
              handleDeleteOpen={this.handleDeleteOpen.bind(this)}
              onThreeColumnsMouseHover={this.onThreeColumnsMouseHover.bind(this)}
              onThreeColumnsMouseLeave={this.onThreeColumnsMouseLeave.bind(this)}
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
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(ThreeColumnsPage);
