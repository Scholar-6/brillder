import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from 'query-string';

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import './BuildPage.scss';
import { AcademicLevel, Brick, BrickLengthEnum, BrickStatus } from "model/brick";
import { User } from "model/user";
import { checkAdmin, checkTeacher, checkEditor } from "components/services/brickService";
import { Filters, SortBy } from '../../model';
import { searchBricks, getCurrentUserBricks, getPublicBricks } from "services/axios/brick";
import { Notification } from 'model/notifications';
import {
  filterByStatus, filterBricks, removeAllFilters,
  removeBrickFromLists, sortBricks, hideBricks, expandBrick, expandSearchBrick, removeBrickFromList
} from '../../service';
import { downKeyPressed, upKeyPressed } from "components/services/key";

import Tab from './Tab';
import FilterSidebar from './FilterSidebar';
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import map from "components/map";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { SubjectItem } from "../model";
import { isPhone } from "services/phone";
import PublishedBricks from "./PublishedBricks";


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

      isAdmin,
      isTeach,
      isEditor,

      shown: true,
      pageSize: 15,

      sortBy: SortBy.None,
      sortedIndex: 0,
      deleteDialogOpen: false,
      deleteBrickId: -1,

      bricksLoaded: false,

      buildCheckedSubjectId: - 1,

      subjects: [],

      filters: {
        draft: false,
        review: false,
        build: false,
        publish: true,
        isCore: true,

        level1: false,
        level2: false,
        level3: false,

        s20: false,
        s40: false,
        s60: false
      },
      handleKey: this.handleKey.bind(this)
    }

    this.getBricks();
  }

  // load bricks when notification come
  componentDidUpdate(prevProps: BuildProps) {
    const {notifications} = this.props;
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

  async getBricks() {
    const {isAdmin, isEditor} = this.state;
    if (isAdmin || isEditor) {
      const bricks = await getPublicBricks();
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

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  moveBack() {
    this.moveAllBack();
  }

  moveNext() {
    this.moveAllNext();
  }

  handleKey(e: any) {
    // only public page
    if (this.state.filters.isCore) {
      if (upKeyPressed(e)) {
        this.moveBack();
      } else if (downKeyPressed(e)) {
        this.moveNext();
      }
    }
  }

  getBrickSubjects(bricks: Brick[]) {
    let subjects:SubjectItem[] = [];
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

  getCore(isAdmin: boolean, isEditor: boolean) {
    let isCore = false;
    if (isAdmin || isEditor) {
      isCore = true;
    }

    const values = queryString.parse(this.props.location.search);
    if (values.isCore) {
      try {
        if (values.isCore === "true") {
          isCore = true;
        } else if (values.isCore === "false") {
          isCore = false;
        }
      } catch {}
    }
    return isCore;
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
    this.props.history.push(map.BackToWorkPagePersonal);
  }

  handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let sortBy = parseInt(e.target.value) as SortBy;
    const { state } = this;
    let bricks = sortBricks(state.finalBricks, sortBy);
    this.setState({ ...state, finalBricks: bricks, sortBy });
  };

  switchPublish() {
    const { filters, buildCheckedSubjectId } = this.state;

    filters.level1 = false;
    filters.level2 = false;
    filters.level3 = false;

    if (!filters.publish) {
      removeAllFilters(filters);
      filters.publish = true;
      let bricks = filterByStatus(this.state.rawBricks, BrickStatus.Publish);
      bricks = bricks.filter(b => b.isCore === true);
      const subjects = this.getBrickSubjects(this.state.rawBricks);
      if (buildCheckedSubjectId >= 0) {
        // if subject checked. subject should exist
        const subject = subjects.find(s => s.id === buildCheckedSubjectId);
        if (subject) {
          bricks = bricks.filter(b => b.subjectId === buildCheckedSubjectId);
        }
      }
      this.setState({ ...this.state, filters, subjects, sortedIndex: 0, finalBricks: bricks });
    } else {
      removeAllFilters(filters);
      filters.build = true;
      filters.review= true;
      filters.draft = true;
      const bricks = filterByStatus(this.state.rawBricks, BrickStatus.Draft);
      bricks.push(...filterByStatus(this.state.rawBricks, BrickStatus.Build));
      bricks.push(...filterByStatus(this.state.rawBricks, BrickStatus.Review));
      const subjects = this.getBrickSubjects(this.state.rawBricks);
      this.setState({ ...this.state, filters, subjects, finalBricks: bricks, sortedIndex: 0 });
    }
  }

  filterUpdated(newFilters: Filters) {
    const { filters } = this.state;
    filters.build = newFilters.build;
    filters.publish = newFilters.publish;
    filters.review = newFilters.review;
    filters.draft = newFilters.draft;
    let finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id);
    const subjects = this.getBrickSubjects(finalBricks);

    let totalBricks = finalBricks;
    
    // published. filter by levels
    if (filters.publish) {
      let levelBricks:Brick[] = [];

      if (filters.level1) {
        levelBricks.push(...finalBricks.filter(b => b.academicLevel === AcademicLevel.First));
      }
      if (filters.level2) {
        levelBricks.push(...finalBricks.filter(b => b.academicLevel === AcademicLevel.Second));
      }
      if (filters.level3) {
        levelBricks.push(...finalBricks.filter(b => b.academicLevel === AcademicLevel.Third));
      }
      
      totalBricks = [];

      if (!filters.level1 && !filters.level2 && !filters.level3) {
        levelBricks = finalBricks;
      }

      if (filters.s20) {
        totalBricks.push(...levelBricks.filter(b => b.brickLength === BrickLengthEnum.S20min));
      }
      if (filters.s40) {
        totalBricks.push(...levelBricks.filter(b => b.brickLength === BrickLengthEnum.S40min));
      }
      if (filters.s60) {
        totalBricks.push(...levelBricks.filter(b => b.brickLength === BrickLengthEnum.S60min));
      }

      if (!filters.s20 && !filters.s40 && !filters.s60) {
        totalBricks = levelBricks;
      }

      if (!filters.level1 && !filters.level2 && !filters.level3 && !filters.s20 && !filters.s40 && !filters.s60) {
        totalBricks = finalBricks;
      }
    }
    this.setState({ ...this.state, filters, subjects, finalBricks: totalBricks, sortedIndex: 0 });
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

  moveToFirstPage() {
    this.setState({sortedIndex: 0});
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
      this.setState({ ...this.state, sortedIndex: index - pageSize});
    }
  }

  moveAllNext(pageSizeParam?: number) {
    let pageSize = pageSizeParam ? pageSizeParam : this.state.pageSize;
    let index = this.state.sortedIndex;

    if (index + pageSize <= this.state.finalBricks.length) {
      this.setState({ ...this.state, sortedIndex: index + pageSize });
    }
  }

  countPublished() {
    let published = 0;
    if (this.props.isSearching) {
      for (let b of this.state.searchBricks) {
        if (b.status === BrickStatus.Publish && b.isCore === true) {
          published++;
        }
      }
    } else {
      for (let b of this.state.rawBricks) {
        if (b.status === BrickStatus.Publish && b.isCore === true) {
          published++;
        }
      }
    }
    return published;
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

  filterPublishedSubject(bs: Brick[], s: SubjectItem) {
    return bs.filter(b => b.subjectId === s.id && b.status === BrickStatus.Publish);
  }

  filterBuildPublishBySubject(s: SubjectItem | null) {
    const {rawBricks} = this.state;
    if (s) {
      const bricks = this.filterPublishedSubject(rawBricks, s);
      this.setState({buildCheckedSubjectId: s.id, finalBricks: bricks});
    } else {
      if (this.state.buildCheckedSubjectId !== -1) {
        const finalBricks = rawBricks.filter(b => b.status === BrickStatus.Publish);
        this.setState({buildCheckedSubjectId: -1, finalBricks});
      }
    }
  }

  filterBuildBySubject(s: SubjectItem | null) {
    const {rawBricks} = this.state;
    const {filters} = this.state;
    if (filters.publish) {
      this.filterBuildPublishBySubject(s);
    } else {
      if (s) {
        const bricks = this.filterInProgressBySubject(rawBricks, s, filters);
        this.setState({buildCheckedSubjectId: s.id, finalBricks: bricks});
      } else {
        if (this.state.buildCheckedSubjectId !== -1) {
          const finalBricks = filterBricks(filters, rawBricks, this.props.user.id);
          this.setState({buildCheckedSubjectId: -1, finalBricks});
        }
      }
    }
  }

  render() {
    const {history} = this.props;
    if (isPhone()) {
      history.push(map.backToWorkUserBased(this.props.user));
      return <PageLoader content="" />;
    }
    let searchString = '';
    if (this.props.isSearching) {
      searchString = this.props.searchString;
    }
    let finalBricks = this.state.finalBricks;
    if (this.props.isSearching) {
      finalBricks = this.state.searchBricks;
    }

    let rawPersonalBricks = this.state.rawBricks.filter(b => !b.isCore);
    
    let isEmpty = rawPersonalBricks.length === 0;

    const published = this.countPublished();

    finalBricks = finalBricks.filter(b => b.isCore === true);

    let selfPublish = 0;
    let personalDraft = 0;

    // publish should have create brick button when empty
    if (this.state.filters.publish) {
      isEmpty = finalBricks.length > 0 ? false : true;
      finalBricks = finalBricks.filter(b => b.status === BrickStatus.Publish);
    } else {
      const coreNoPublishBricks =  this.state.rawBricks
        .filter(b => b.isCore === true)
        .filter(b => b.status !== BrickStatus.Publish);
      isEmpty = coreNoPublishBricks.length > 0 ? false : true;
    }

    return (
      <Grid container direction="row" className="sorted-row build-page-content">
        <FilterSidebar
          user={this.props.user}
          history={this.props.history}
          finalBricks={finalBricks}
          filters={this.state.filters}
          sortBy={this.state.sortBy}
          isEmpty={isEmpty}
          subjects={this.state.subjects}
          handleSortChange={e => this.handleSortChange(e)}
          filterChanged={this.filterUpdated.bind(this)}
          filterBySubject={this.filterBuildBySubject.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <Tab
            draft={personalDraft}
            selfPublish={selfPublish}
            onCoreSwitch={this.toggleCore.bind(this)}
          />
            <PublishedBricks
              user={this.props.user}
              finalBricks={finalBricks}
              shown={this.state.shown}
              pageSize={18}
              sortedIndex={this.state.sortedIndex}
              history={history}
              filters={this.state.filters}
              loaded={this.state.bricksLoaded}
              searchString={searchString}
              published={published}
              moveNext={this.moveAllNext.bind(this)}
              moveBack={this.moveAllBack.bind(this)}
              switchPublish={this.switchPublish.bind(this)}
              handleDeleteOpen={this.handleDeleteOpen.bind(this)}
              handleMouseHover={this.handleMouseHover.bind(this)}
              handleMouseLeave={this.handleMouseLeave.bind(this)}
            />
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
