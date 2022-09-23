import React, { Component } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import './BuildPage.scss';
import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { checkAdmin, checkTeacher, checkEditor } from "components/services/brickService";
import { Filters, SortBy } from '../../model';
import { getPersonalBricks, searchBricks, getCurrentUserBricks, getBackToWorkStatistics } from "services/axios/brick";
import { Notification } from 'model/notifications';
import {
  removeBrickFromLists, removeBrickFromList
} from '../../service';

import PersonalBuild from "../personalBuild/PersonalBuild";
import map from "components/map";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { SubjectItem } from "../personalBuild/model";
import { isPhone } from "services/phone";


interface BuildProps {
  searchString: string;
  isSearching: boolean;
  searchDataLoaded: boolean;

  user: User;
  history: any;
  location: any;

  // redux
  notifications: Notification[] | null;
  searchFinished(): void;
  requestFailed(e: string): void;
}

interface BuildState {
  finalBricks: Brick[]; // bricks to display
  rawBricks: Brick[]; // loaded bricks
  searchBricks: Brick[]; // searching bricks

  isTeach: boolean;
  isAdmin: boolean;
  isEditor: boolean;

  draftCount: number;
  buildCount: number;
  reviewCount: number;
  publishedCount: number;

  shown: boolean;
  sortBy: SortBy;
  sortedIndex: number;
  filters: Filters;
  pageSize: number;

  deleteDialogOpen: boolean;
  deleteBrickId: number;

  subjects: SubjectItem[];

  buildCheckedSubjectId: number;

  bricksLoaded: boolean;
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

      isAdmin,
      isTeach,
      isEditor,

      draftCount: 0,
      buildCount: 0,
      reviewCount: 0,
      publishedCount: 0,

      shown: true,
      pageSize: 17,

      sortBy: SortBy.None,
      sortedIndex: 0,
      deleteDialogOpen: false,
      deleteBrickId: -1,

      bricksLoaded: false,

      buildCheckedSubjectId: - 1,

      subjects: [],

      filters: {
        draft: true,
        review: true,
        build: true,
        publish: false,
        isCore: false,

        level1: false,
        level2: false,
        level3: false,

        s20: false,
        s40: false,
        s60: false
      },
    }

    this.getBricks();
  }

  // load bricks when notification come
  componentDidUpdate(prevProps: BuildProps) {
    const { notifications } = this.props;
    const oldNotifications = prevProps.notifications;
    if (notifications && oldNotifications) {
      if (notifications.length > oldNotifications.length) {
        this.getBricks();
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
              bricksLoaded: true, sortedIndex: 0
            });
            this.props.searchFinished();
          }, 1400);
        } else {
          this.props.requestFailed('Can`t get bricks by search');
        }
      });
    }
  }

  async getBricks() {
    const { isAdmin, isEditor } = this.state;
    if (isAdmin || isEditor) {
      const bricks = await getPersonalBricks();
      const bricksCount = await getBackToWorkStatistics(false, true, true);
      if (bricksCount) {
        if (bricksCount.draftCount != undefined && bricksCount.buildCount != undefined && bricksCount.reviewCount != undefined && bricksCount.publishedCount != undefined) {
          this.setState({
            draftCount: bricksCount.draftCount,
            buildCount: bricksCount.buildCount,
            reviewCount: bricksCount.reviewCount,
            publishedCount: bricksCount.publishedCount
          });
        }
      }
      if (bricks) {
        let bs = bricks.sort((a, b) => (new Date(b.updated).getTime() < new Date(a.updated).getTime()) ? -1 : 1);
        bs = bs.sort(b => (b.editors && b.editors.find(e => e.id === this.props.user.id)) ? -1 : 1);
        bs = bs.sort((a, b) => (b.hasNotifications === true && new Date(b.updated).getTime() > new Date(a.updated).getTime()) ? -1 : 1);
        this.setBricks(bs);
      } else {
        this.props.requestFailed('Can`t get bricks');
      }
    } else {
      getCurrentUserBricks().then(bricks => {
        if (bricks) {
          this.setBricks(bricks);
        } else {
          this.props.requestFailed('Can`t get bricks for current user');
        }
      });
    }
  }

  moveBack() {
    this.moveAllBack();
  }

  moveNext() {
    this.moveAllNext();
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
      if (this.state.filters.publish === true) {
        if (brick.status !== BrickStatus.Publish) {
          continue;
        }
      } else {
        if (brick.status === BrickStatus.Publish) {
          continue;
        }
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

  setBricks(rawBricks: Brick[]) {
    let finalBricks = rawBricks
    if (!this.state.filters.isCore) {
      finalBricks = rawBricks.filter(b => !b.isCore);
    }
    finalBricks = finalBricks.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
    const subjects = this.getBrickSubjects(rawBricks);
    this.setState({ ...this.state, finalBricks, subjects, rawBricks, bricksLoaded: true });
  }

  toggleCore() {
    this.props.history.push(map.BackToWorkPage);
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

  delete(brickId: number) {
    let { rawBricks, finalBricks } = this.state;
    removeBrickFromLists(rawBricks, finalBricks, brickId);
    removeBrickFromList(this.state.searchBricks, brickId);
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  moveAllBack(pageSizeParam?: number) {
    let pageSize = pageSizeParam ? pageSizeParam : this.state.pageSize;
    let index = this.state.sortedIndex;

    if (index >= pageSize) {
      this.setState({ ...this.state, sortedIndex: index - pageSize });
    }
  }

  moveAllNext(pageSizeParam?: number) {
    let pageSize = pageSizeParam ? pageSizeParam : this.state.pageSize;
    let index = this.state.sortedIndex;

    if (index + pageSize <= this.state.finalBricks.length) {
      this.setState({ ...this.state, sortedIndex: index + pageSize });
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

    let rawPersonalBricks = this.state.rawBricks.filter(b => !b.isCore);

    let isEmpty = rawPersonalBricks.length === 0;

    if (!this.state.isAdmin) {
      finalBricks = finalBricks.filter(b => b.author.id === this.props.user.id);
    }

    return <PersonalBuild
      user={this.props.user}
      finalBricks={finalBricks}
      loaded={this.state.bricksLoaded}
      shown={this.state.shown}
      draft={this.state.draftCount}
      build={this.state.buildCount}
      review={this.state.reviewCount}
      publish={this.state.publishedCount}
      pageSize={17}
      sortedIndex={this.state.sortedIndex}
      history={history}
      isTeach={this.state.isTeach || this.state.isAdmin}
      isSearching={this.props.isSearching}
      searchString={this.props.searchString}
      isFilterEmpty={isEmpty}

      deleteDialogOpen={this.state.deleteDialogOpen}
      deleteBrickId={this.state.deleteBrickId}
      delete={this.delete.bind(this)}
      handleDeleteClose={this.handleDeleteClose.bind(this)}

      toggleCore={this.toggleCore.bind(this)}
      setTab={() => { }}

      moveAllNext={() => this.moveAllNext(17)}
      moveAllBack={() => this.moveAllBack(17)}
      moveToFirstPage={this.moveToFirstPage.bind(this)}

      handleDeleteOpen={this.handleDeleteOpen.bind(this)}
    />
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
