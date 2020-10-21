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
import { getBricks, searchBricks, getCurrentUserBricks } from "services/axios/brick";
import { Notification } from 'model/notifications';
import {
  filterByStatus, filterBricks, removeInboxFilters, removeAllFilters,
  removeBrickFromLists, sortBricks, hideBricks, expandBrick, expandSearchBrick
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
import PersonalBuild from "../personalBuild/PersonalBuild";

interface BuildProps {
  searchString: string;
  isSearching: boolean;

  user: User;
  history: any;
  location: any;
  setTab(t: ActiveTab): void;

  // redux
  notifications: Notification[] | null;
  requestFailed(e: string): void;
}

interface BuildState {
  finalBricks: Brick[]; // bricks to display
  rawBricks: Brick[]; // loaded bricks
  threeColumns: ThreeColumns;
  searchBricks: Brick[]; // searching bricks
  searchThreeColumns: ThreeColumns;

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

  bricksLoaded: boolean;
  hoverTimeout: number;
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
      searchBricks: [],
      searchThreeColumns: threeColumns,

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

      hoverTimeout: -1,

      filters: {
        viewAll: true,
        buildAll: false,
        editAll: false,

        draft: true,
        review: true,
        build: true,
        publish: false,
        isCore
      }
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
    if (nextProps.isSearching) {
      this.setState({ searchBricks: [], shown: false, bricksLoaded: false, sortedIndex: 0 });
      searchBricks(nextProps.searchString).then(bricks => {
        if (bricks) {
          setTimeout(() => {
            const searchThreeColumns = prepareTreeRows(bricks, this.state.filters, this.props.user.id);
            this.setState({
              ...this.state, searchBricks: bricks, shown: true,
              bricksLoaded: true, sortedIndex: 0,
              searchThreeColumns
            });
          }, 1400);
        } else {
          this.props.requestFailed('Can`t get bricks by search');
        }
      });
    } else {
      if (this.props.isSearching === false) {
        //this.setState({ finalBricks: this.state.rawBricks});
      }
    }
  }

  async getBricks() {
    const {isAdmin, isEditor} = this.state;
    if (isAdmin || isEditor) {
      const bricks = await getBricks();
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
    const threeColumns = prepareTreeRows(rawBricks, this.state.filters, this.props.user.id);
    let finalBricks = rawBricks
    if (!this.state.filters.isCore) {
      finalBricks = rawBricks.filter(b => !b.isCore);
    }
    this.setState({ ...this.state, finalBricks, rawBricks, threeColumns, bricksLoaded: true });
  }

  toggleCore() {
    const { filters } = this.state;
    filters.isCore = !filters.isCore;
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks);
    const threeColumns = prepareTreeRows(this.state.rawBricks, this.state.filters, this.props.user.id);
    this.setState({ ...this.state, sortedIndex: 0, threeColumns, filters, finalBricks });
  }

  handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let sortBy = parseInt(e.target.value) as SortBy;
    const { state } = this;
    let bricks = sortBricks(state.finalBricks, sortBy);
    this.setState({ ...state, finalBricks: bricks, sortBy });
  };

  switchPublish() {
    const { filters} = this.state;
    if (!filters.publish) {
      removeAllFilters(filters);
      filters.publish = true;
      const bricks = filterByStatus(this.state.rawBricks, BrickStatus.Publish);
      this.setState({ ...this.state, filters, sortedIndex: 0, finalBricks: bricks });
    } else {
      removeAllFilters(filters);
      filters.build = true;
      filters.review= true;
      filters.draft = true;
      filters.viewAll = true;
      this.setState({ ...this.state, filters, sortedIndex: 0 });
    }
  }

  showAll() {
    const { filters } = this.state;
    removeAllFilters(filters);
    filters.viewAll = true;
    filters.review = true;
    filters.draft = true;
    this.setState({ ...this.state, filters, sortedIndex: 0, finalBricks: this.state.rawBricks });
  }

  showEditAll() {
    const { filters } = this.state;
    removeAllFilters(filters);
    filters.editAll = true;
    filters.review = true;
    const finalBricks = filterBricks(filters, this.state.rawBricks);
    this.setState({ ...this.state, sortedIndex: 0, filters, finalBricks });
  }

  showBuildAll() {
    const { filters } = this.state;
    removeAllFilters(filters);
    filters.build = true;
    filters.buildAll = true;
    filters.draft = true;
    const finalBricks = filterBricks(filters, this.state.rawBricks);
    this.setState({ ...this.state, sortedIndex: 0, filters, finalBricks });
  }

  filterUpdated(newFilters: Filters) {
    const { filters } = this.state;
    filters.build = newFilters.build;
    filters.publish = newFilters.publish;
    filters.review = newFilters.review;
    filters.draft = newFilters.draft;
    removeInboxFilters(filters);
    if (filters.build && filters.review && filters.draft) {
      filters.viewAll = true;
    } else if (filters.draft && filters.build) {
      filters.editAll = true;
    } else if (filters.draft && !filters.review) {
      filters.buildAll = true;
    }
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks);
    this.setState({ ...this.state, filters, finalBricks, sortedIndex: 0 });
  }

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({ ...this.state, deleteDialogOpen: true, deleteBrickId });
  }

  handleDeleteClose() {
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  handleMouseHover(index: number) {
    let bricks = this.state.finalBricks;
    if (this.props.isSearching) {
      bricks = this.state.searchBricks;
      hideBricks(bricks);
    } else {
      hideBricks(this.state.rawBricks);
    }

    if (bricks[index] && bricks[index].expanded) return;
    this.setState({ ...this.state });

    setTimeout(() => {
      if (this.props.isSearching) {
        expandSearchBrick(this.state.searchBricks, index);
        console.log(index, this.state.searchBricks);
      } else {
        expandBrick(this.state.finalBricks, this.state.rawBricks, index);
      }
      this.setState({ ...this.state });
    }, 400);
  }

  handleMouseLeave(key: number) {
    let bricks = this.state.finalBricks;
    if (this.props.isSearching) {
      bricks = this.state.searchBricks;
      hideBricks(this.state.searchBricks);
    } else {
      hideBricks(this.state.rawBricks);
    }
    bricks[key].expandFinished = true;
    this.setState({ ...this.state });
    setTimeout(() => {
      bricks[key].expandFinished = false;
      this.setState({ ...this.state });
    }, 400);
  }

  onThreeColumnsMouseHover(index: number, status: BrickStatus) {
    let key = Math.floor(index / 3);

    let {threeColumns} = this.state;
    if (this.props.isSearching) {
      threeColumns = this.state.searchThreeColumns;
      hideBricks(this.state.searchBricks);
    } else {
      hideBricks(this.state.rawBricks);
    }
    let name = getThreeColumnName(status);
    let brick = getThreeColumnBrick(threeColumns, name, key);
    if (brick.expanded) return;

    clearTimeout(this.state.hoverTimeout);

    const hoverTimeout = setTimeout(() => {
      try {
        let {threeColumns} = this.state;
        if (this.props.isSearching) {
          threeColumns = this.state.searchThreeColumns;
          hideBricks(this.state.searchBricks);
        } else {
          hideBricks(this.state.rawBricks);
        }
        let name = getThreeColumnName(status);
        expandThreeColumnBrick(threeColumns, name, key + this.state.sortedIndex);
        this.setState({ ...this.state });
      } catch {}
    }, 400);
    this.setState({ ...this.state, hoverTimeout });
  }

  onThreeColumnsMouseLeave(index: number, status: BrickStatus) {
    let {threeColumns} = this.state;
    if (this.props.isSearching) {
      threeColumns = this.state.searchThreeColumns;
      hideBricks(this.state.searchBricks);
    } else {
      hideBricks(this.state.rawBricks);
    }

    let key = Math.ceil(index / 3);
    let name = getThreeColumnName(status);
    let brick = getThreeColumnBrick(threeColumns, name, key + this.state.sortedIndex);

    if (brick) {
      brick.expandFinished = true;
      this.setState({ ...this.state });
      setTimeout(() => {
        try {
          if (brick) {
            brick.expandFinished = false;
            this.setState({ ...this.state });
          }
        } catch {}
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
    let pageSize = this.state.pageSize + 3;
    let index = this.state.sortedIndex;
    if (index >= pageSize) {
      this.setState({ ...this.state, sortedIndex: index - pageSize });
    }
  }

  moveAllNext() {
    let pageSize = this.state.pageSize + 3;
    let index = this.state.sortedIndex;
    if (index + pageSize <= this.state.finalBricks.length) {
      this.setState({ ...this.state, sortedIndex: index + pageSize });
    }
  }

  renderPagination = (finalBricks: Brick[], threeColumns: ThreeColumns) => {
    let { sortedIndex, pageSize } = this.state;

    if (this.state.filters.viewAll) {
      const longestColumn = getLongestColumn(threeColumns);
  
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
        pageSize={pageSize+3}
        bricksLength={finalBricks.length}
        moveNext={() => this.moveAllNext()}
        moveBack={() => this.moveAllBack()}
      />
    );
  }

  render() {
    let searchString = '';
    if (this.props.isSearching) {
      searchString = this.props.searchString;
    }
    let finalBricks = this.state.finalBricks;
    let threeColumns = this.state.threeColumns;
    if (this.props.isSearching) {
      finalBricks = this.state.searchBricks;
      threeColumns = this.state.searchThreeColumns;
    }
    let published = 0;
    for (let b of this.state.rawBricks) {
      if (b.status === BrickStatus.Publish && b.isCore === true) {
        published++;
      }
    }

    if (!this.state.filters.isCore) {
      return <PersonalBuild
        user={this.props.user}
        finalBricks={finalBricks}
        loaded={this.state.bricksLoaded}
        shown={this.state.shown}
        pageSize={this.state.pageSize}
        sortedIndex={this.state.sortedIndex}
        history={this.props.history}
        isTeach={this.state.isTeach || this.state.isAdmin}
        searchString={this.props.searchString}

        deleteDialogOpen={this.state.deleteDialogOpen}
        deleteBrickId={this.state.deleteBrickId}
        delete={this.delete.bind(this)}
        handleDeleteClose={this.handleDeleteClose.bind(this)}

        toggleCore={this.toggleCore.bind(this)}
        setTab={this.props.setTab.bind(this)}

        moveAllNext={this.moveAllNext.bind(this)}
        moveAllBack={this.moveAllBack.bind(this)}

        handleDeleteOpen={this.handleDeleteOpen.bind(this)}
        handleMouseHover={this.handleMouseHover.bind(this)}
        handleMouseLeave={this.handleMouseLeave.bind(this)}
      />
    }

    finalBricks = finalBricks.filter(b => b.isCore === true);

    return (
      <Grid container direction="row" className="sorted-row">
        <FilterSidebar
          finalBricks={finalBricks}
          threeColumns={threeColumns}
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
            isCore={this.state.filters.isCore}
            onCoreSwitch={this.toggleCore.bind(this)}
            setTab={this.props.setTab}
          />
            <div className="tab-content">
              <BuildBricks
                user={this.props.user}
                finalBricks={finalBricks}
                threeColumns={threeColumns}
                shown={this.state.shown}
                pageSize={this.state.pageSize}
                sortedIndex={this.state.sortedIndex}
                history={this.props.history}
                filters={this.state.filters}
                loaded={this.state.bricksLoaded}
                searchString={searchString}
                published={published}
                switchPublish={this.switchPublish.bind(this)}
                handleDeleteOpen={this.handleDeleteOpen.bind(this)}
                handleMouseHover={this.handleMouseHover.bind(this)}
                handleMouseLeave={this.handleMouseLeave.bind(this)}
                onThreeColumnsMouseHover={this.onThreeColumnsMouseHover.bind(this)}
                onThreeColumnsMouseLeave={this.onThreeColumnsMouseLeave.bind(this)}
              />
              {this.renderPagination(finalBricks, threeColumns)}
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
