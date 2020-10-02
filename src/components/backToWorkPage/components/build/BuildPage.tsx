import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from 'query-string';

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { checkAdmin, checkTeacher, checkEditor } from "components/services/brickService";
import { ThreeColumns, Filters, SortBy } from '../../model';
import { getBricks, searchBricks, getCurrentUserBricks } from "components/services/axios/brick";
import {
  filterByStatus, filterBricks, removeInboxFilters, removeAllFilters,
  removeBrickFromLists, sortBricks, hideBricks, expandBrick
} from '../../service';
import {
  getThreeColumnName, prepareTreeRows,
  getThreeColumnBrick, expandThreeColumnBrick, getLongestColumn
} from '../../threeColumnService';

import Tab, { ActiveTab } from '../Tab';
import BuildBricks from './BuildBricks';
import FilterSidebar from './FilterSidebar';
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import BackPagePagination from '../BackPagePagination';
import BackPagePaginationV2 from '../BackPagePaginationV2';

interface BuildProps {
  searchString: string;
  isSearching: boolean;

  user: User;
  generalSubjectId: number;
  history: any;
  location: any;
  setTab(t: ActiveTab): void;

  // redux
  requestFailed(e: string): void;
}

interface BuildState {
  finalBricks: Brick[]; // bricks to display
  rawBricks: Brick[]; // loaded bricks
  threeColumns: ThreeColumns;

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
}

class BuildPage extends Component<BuildProps, BuildState> {
  constructor(props: BuildProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user.roles);
    const isAdmin = checkAdmin(this.props.user.roles);
    const isEditor = checkEditor(this.props.user.roles)
    const isCore = this.getCore(isAdmin, isEditor);

    let threeColumns = {
      red: {
        rawBricks: [],
        finalBricks: []
      },
      yellow: {
        rawBricks: [],
        finalBricks: []
      },
      green: {
        rawBricks: [],
        finalBricks: []
      }
    } as ThreeColumns;

    this.state = {
      finalBricks: [],
      rawBricks: [],
      threeColumns,

      isAdmin,
      isTeach,
      isEditor,

      shown: true,
      pageSize: 18,

      sortBy: SortBy.None,
      sortedIndex: 0,
      deleteDialogOpen: false,
      deleteBrickId: -1,

      filters: {
        viewAll: true,
        buildAll: false,
        editAll: false,

        draft: true,
        review: true,
        publish: true,
        isCore
      }
    }

    this.getBricks();
  }

  componentWillReceiveProps(nextProps: BuildProps) {
    if (nextProps.isSearching) {
      searchBricks(nextProps.searchString).then(bricks => {
        if (bricks) {
          this.setState({ finalBricks: [], shown: false });
          const threeColumns = prepareTreeRows(bricks, this.state.filters, this.props.user.id, this.props.generalSubjectId);
          setTimeout(() => {
            this.setState({ ...this.state, finalBricks: bricks, shown: true, threeColumns });
          }, 1400);
        } else {
          this.props.requestFailed('Can`t get bricks by search');
        }
      });
    } else {
      if (this.props.isSearching === false) {
        this.setState({ finalBricks: this.state.rawBricks});
      }
    }
  }

  getBricks() {
    const {isAdmin, isEditor} = this.state;
    if (isAdmin || isEditor) {
      getBricks().then(bricks => {
        if (bricks) {
          let bs = bricks.sort((a, b) => (new Date(b.updated).getTime() < new Date(a.updated).getTime()) ? -1 : 1);
          bs = bs.sort(b => (b.editors && b.editors.find(e => e.id === this.props.user.id)) ? -1 : 1);
          bs = bs.sort((a, b) => (b.hasNotifications === true && new Date(b.updated).getTime() > new Date(a.updated).getTime()) ? -1 : 1);
          this.setBricks(bs);
        } else {
          this.props.requestFailed('Can`t get bricks');
        }
      });
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
    const threeColumns = prepareTreeRows(rawBricks, this.state.filters, this.props.user.id, this.props.generalSubjectId);
    this.setState({ ...this.state, finalBricks: rawBricks, rawBricks, threeColumns });
  }

  toggleCore() {
    const { filters } = this.state;
    filters.isCore = !filters.isCore;
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id, this.props.generalSubjectId);
    const threeColumns = prepareTreeRows(this.state.rawBricks, this.state.filters, this.props.user.id, this.props.generalSubjectId);
    this.setState({ ...this.state, threeColumns, filters, finalBricks });
  }

  handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let sortBy = parseInt(e.target.value) as SortBy;
    const { state } = this;
    let bricks = sortBricks(state.finalBricks, sortBy);
    this.setState({ ...state, finalBricks: bricks, sortBy });
  };

  showAll() {
    const { filters } = this.state;
    removeAllFilters(filters);
    filters.viewAll = true;
    filters.publish = true;
    filters.review = true;
    filters.draft = true;
    this.setState({ ...this.state, filters, sortedIndex: 0, finalBricks: this.state.rawBricks });
  }

  showEditAll() {
    const { filters } = this.state;
    removeAllFilters(filters);
    filters.editAll = true;
    filters.publish = true;
    filters.review = true;
    let bricks = filterByStatus(this.state.rawBricks, BrickStatus.Review);
    bricks.push(...filterByStatus(this.state.rawBricks, BrickStatus.Publish));
    this.setState({ ...this.state, sortedIndex: 0, filters, finalBricks: bricks });
  }

  showBuildAll() {
    const { filters } = this.state;
    removeAllFilters(filters);
    filters.buildAll = true;
    filters.draft = true;
    let bricks = filterByStatus(this.state.rawBricks, BrickStatus.Draft);
    this.setState({ ...this.state, sortedIndex: 0, filters, finalBricks: bricks });
  }

  filterUpdated(newFilters: Filters) {
    const { filters } = this.state;
    filters.publish = newFilters.publish;
    filters.review = newFilters.review;
    filters.draft = newFilters.draft;
    removeInboxFilters(filters);
    if (filters.publish && filters.review && filters.draft) {
      filters.viewAll = true;
    } else if (filters.draft && filters.review) {
      filters.editAll = true;
    } else if (filters.draft && !filters.publish) {
      filters.buildAll = true;
    }
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id, this.props.generalSubjectId);
    this.setState({ ...this.state, filters, finalBricks, sortedIndex: 0 });
  }

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({ ...this.state, deleteDialogOpen: true, deleteBrickId });
  }

  handleDeleteClose() {
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  handleMouseHover(index: number) {
    let { finalBricks } = this.state;
    if (finalBricks[index] && finalBricks[index].expanded) return;

    hideBricks(this.state.rawBricks);
    hideBricks(this.state.finalBricks);

    this.setState({ ...this.state });
    setTimeout(() => {
      expandBrick(this.state.finalBricks, this.state.rawBricks, index);
      this.setState({ ...this.state });
    }, 400);
  }

  handleMouseLeave(key: number) {
    let { finalBricks } = this.state;
    hideBricks(this.state.rawBricks);
    finalBricks[key].expandFinished = true;
    this.setState({ ...this.state });
    setTimeout(() => {
      finalBricks[key].expandFinished = false;
      this.setState({ ...this.state });
    }, 400);
  }

  onThreeColumnsMouseHover(index: number, status: BrickStatus) {
    let key = Math.floor(index / 3);

    const {threeColumns} = this.state;
    let name = getThreeColumnName(status);
    let brick = getThreeColumnBrick(threeColumns, name, key);
    if (brick.expanded) return;

    hideBricks(this.state.rawBricks);
    hideBricks(this.state.finalBricks);

    this.setState({ ...this.state });

    setTimeout(() => {
      hideBricks(this.state.rawBricks);
      let name = getThreeColumnName(status);
      expandThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);
      this.setState({ ...this.state });
    }, 400);
  }

  onThreeColumnsMouseLeave(index: number, status: BrickStatus) {
    hideBricks(this.state.rawBricks);

    let key = Math.ceil(index / 3);
    let name = getThreeColumnName(status);
    let brick = getThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);

    if (brick) {
      brick.expandFinished = true;
      this.setState({ ...this.state });
      setTimeout(() => {
        if (brick) {
          brick.expandFinished = false;
          this.setState({ ...this.state });
        }
      }, 400);
    }
  }

  delete(brickId: number) {
    let { rawBricks, finalBricks, threeColumns } = this.state;
    removeBrickFromLists(rawBricks, finalBricks, threeColumns, brickId);
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  moveThreeColumnsNext() {
    const { threeColumns } = this.state;
    const longest = getLongestColumn(threeColumns);
    const { pageSize } = this.state;

    let index = this.state.sortedIndex;
    if (index + pageSize / 3 <= longest) {
      this.setState({ ...this.state, sortedIndex: index + (pageSize / 3) });
    }
  }

  moveThreeColumnsBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize / 3) {
      this.setState({ ...this.state, sortedIndex: index - (this.state.pageSize / 3) });
    }
  }

  moveAllBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize) {
      this.setState({ ...this.state, sortedIndex: index - this.state.pageSize });
    }
  }

  moveAllNext() {
    let index = this.state.sortedIndex;
    if (index + this.state.pageSize <= this.state.finalBricks.length) {
      this.setState({ ...this.state, sortedIndex: index + this.state.pageSize });
    }
  }

  renderPagination = () => {
    let { sortedIndex, pageSize } = this.state;

    if (this.state.filters.viewAll) {
      const longestColumn = getLongestColumn(this.state.threeColumns);
  
      return (
        <BackPagePaginationV2
          sortedIndex={sortedIndex}
          pageSize={pageSize}
          longestColumn={longestColumn}
          moveNext={() => this.moveThreeColumnsNext()}
          moveBack={() => this.moveThreeColumnsBack()}
        />
      )
    }
    return (
      <BackPagePagination
        sortedIndex={sortedIndex}
        pageSize={pageSize}
        bricksLength={this.state.finalBricks.length}
        moveNext={() => this.moveAllNext()}
        moveBack={() => this.moveAllBack()}
      />
    );
  }

  render() {
    return (
      <Grid container direction="row" className="sorted-row">
        <FilterSidebar
          rawBricks={this.state.rawBricks}
          filters={this.state.filters}
          sortBy={this.state.sortBy}
          handleSortChange={e => this.handleSortChange(e)}
          showAll={() => this.showAll()}
          showBuildAll={() => this.showBuildAll()}
          showEditAll={() => this.showEditAll()}
          filterChanged={this.filterUpdated.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <Tab
            isTeach={this.state.isTeach || this.state.isAdmin}
            activeTab={ActiveTab.Build}
            setTab={this.props.setTab}
          />
            <div className="tab-content">
              <BuildBricks
                user={this.props.user}
                finalBricks={this.state.finalBricks}
                threeColumns={this.state.threeColumns}
                shown={this.state.shown}
                pageSize={this.state.pageSize}
                sortedIndex={this.state.sortedIndex}
                history={this.props.history}
                filters={this.state.filters}
                toggleCore={() => this.toggleCore()}
                handleDeleteOpen={this.handleDeleteOpen.bind(this)}
                handleMouseHover={this.handleMouseHover.bind(this)}
                handleMouseLeave={this.handleMouseLeave.bind(this)}
                onThreeColumnsMouseHover={this.onThreeColumnsMouseHover.bind(this)}
                onThreeColumnsMouseLeave={this.onThreeColumnsMouseLeave.bind(this)}
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

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(BuildPage);
