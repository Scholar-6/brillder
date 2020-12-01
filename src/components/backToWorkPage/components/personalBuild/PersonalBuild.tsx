import React, { Component } from "react";

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { prepareVisibleBricks } from '../../service';
import { downKeyPressed, upKeyPressed } from "components/services/key";
import { hideBricks, expandSearchBrick } from '../../service';

import './PersonalBuild.scss';
import BrickBlock from "components/baseComponents/BrickBlock";
import { Grid } from "@material-ui/core";
import FilterSidebar from "./FilterSidebar";
import Tab from "components/assignmentsPage/components/Tab";
import BackPagePagination from "../BackPagePagination";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import { PersonalFilters, SubjectItem } from "./model";
import CreateBrickBlock from "../CreateBrickBlock";

interface PersonalBuildProps {
  user: User;
  finalBricks: Brick[];
  loaded: boolean;
  shown: boolean;
  pageSize: number;
  sortedIndex: number;
  history: any;
  isFilterEmpty: boolean;
  isTeach: boolean;
  searchString: string;
  isSearching: boolean;

  deleteDialogOpen: boolean;
  deleteBrickId: number;
  delete(brickId: number): void;
  handleDeleteClose(): void;

  toggleCore(): void;
  setTab(): void;

  moveAllNext(): void;
  moveAllBack(): void;
  moveToFirstPage(): void;

  // brick events
  handleDeleteOpen(brickId: number): void;
}


interface PersonalState {
  bricks: Brick[];
  filters: PersonalFilters;
  checkedSubjectId: number;
  handleKey(e: any): void;
}

class PersonalBuild extends Component<PersonalBuildProps, PersonalState> {
  constructor(props: PersonalBuildProps) {
    super(props);

    this.state = {
      bricks: this.props.finalBricks,
      checkedSubjectId: -1,
      filters: {
        draft: true,
        selfPublish: true
      },
      handleKey: this.handleKey.bind(this)
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  handleMouseHover(index: number) {
    let bricks = this.getDisplayBricks();
    hideBricks(bricks);

    if (bricks[index] && bricks[index].expanded) return;
    this.setState({ ...this.state });

    setTimeout(() => {
      expandSearchBrick(bricks, index);
      this.setState({ ...this.state });
    }, 400);
  }

  handleMouseLeave(key: number) {
    let bricks = this.getDisplayBricks();
    hideBricks(bricks);
    bricks[key].expandFinished = true;
    this.setState({ ...this.state });
    setTimeout(() => {
      bricks[key].expandFinished = false;
      this.setState({ ...this.state });
    }, 400);
  }

  setFilters(filters: PersonalFilters) {
    this.setState({filters, checkedSubjectId: -1});
    this.props.moveToFirstPage();
  }

  filterBySubject(s: SubjectItem | null) {
    if (s) {
      this.setState({checkedSubjectId: s.id});
    } else {
      if (this.state.checkedSubjectId !== -1) {
        this.setState({checkedSubjectId: -1});
      }
    }
  }

  handleKey(e: any) {
    if (upKeyPressed(e)) {
      this.props.moveAllBack();
    } else if (downKeyPressed(e)) {
      let bricks:Brick[] = [];
      let pageSize = this.props.pageSize + 3;
      let index = this.props.sortedIndex;

      if (this.state.filters.draft) {
        const draftBricks = this.props.finalBricks.filter(b => b.status === BrickStatus.Draft || b.status === BrickStatus.Review || b.status === BrickStatus.Build);
        bricks.push(...draftBricks);
      } else if (this.state.filters.selfPublish) {
        const selfPublishBricks = this.props.finalBricks.filter(b => b.status === BrickStatus.Publish);
        bricks.push(...selfPublishBricks);
      }
  
      if (index + pageSize <= bricks.length) {
        this.props.moveAllNext();
      }
    }
  }

  renderBricks = (bricks: Brick[]) => {
    const data = prepareVisibleBricks(this.props.sortedIndex, this.props.pageSize, bricks);

    let res = data.map(item =>
      {
        let circleIcon = '';
        if (item.brick.adaptedFrom) {
          circleIcon = 'copy';
        }
        return (
          <BrickBlock
            brick={item.brick}
            index={item.index}
            row={item.row}
            user={this.props.user}
            key={item.index}
            shown={this.props.shown}
            history={this.props.history}
            circleIcon={circleIcon}
            iconColor=''
            searchString={this.props.searchString}
            handleDeleteOpen={brickId => this.props.handleDeleteOpen(brickId)}
            handleMouseHover={() => this.handleMouseHover(item.key)}
            handleMouseLeave={() => this.handleMouseLeave(item.key)}
          />
        );
      });
    res.unshift(<CreateBrickBlock history={this.props.history} isCore={true} />);
    return res;
  }

  renderFirstEmptyColumn() {
    return (
      <div className="main-brick-container empty-description first" key={-2}>
        <div>
          <div className="centered">
            <div className="circle b-red"></div>
          </div>
          <div className="bold empty-title">Red indicates bricks under construction.</div>
        </div>
      </div>
    );
  }

  renderSecondEmptyColumn() {
    return (
      <div className="main-brick-container empty-description second" key={-3}>
        <div>
          <div className="circle white-in-yellow centered">
            <div className="circle b-white"></div>
          </div>
          <div className="bold empty-title">Amber indicates self-published bricks.</div>
        </div>
      </div>
    );
  }

  renderEmptyPage() {
    return (
      <div className="bricks-list-container no-top-padding">
        <div className="bricks-list">
          {this.renderFirstEmptyColumn()}
          {this.renderSecondEmptyColumn()}
        </div>
      </div>
    );
  }

  renderPagination = (finalBricks: Brick[]) => {
    let { sortedIndex, pageSize } = this.props;

    return (
      <BackPagePagination
        sortedIndex={sortedIndex}
        pageSize={pageSize}
        isRed={sortedIndex === 0}
        bricksLength={finalBricks.length}
        moveNext={() => this.props.moveAllNext()}
        moveBack={() => this.props.moveAllBack()}
      />
    );
  }

  getDisplayBricks() {
    let bricks:Brick[] = [];
    if (this.state.filters.draft) {
      const draftBricks = this.props.finalBricks.filter(b => b.status !== BrickStatus.Publish);
      bricks.push(...draftBricks);
    }
    if (this.state.filters.selfPublish) {
      const selfPublishBricks = this.props.finalBricks.filter(b => b.status === BrickStatus.Publish);
      bricks.push(...selfPublishBricks);
    }

    let displayBricks = bricks;

    if (this.state.checkedSubjectId !== -1) {
      displayBricks = bricks.filter(b => b.subjectId === this.state.checkedSubjectId);
    }
    return displayBricks;
  }

  render() {
    let isEmpty = false;

    if (this.props.finalBricks.length === 0) {
      isEmpty = true;
    }

    let draft = 0;
    let selfPublish = 0;
    let bricks:Brick[] = [];
    if (this.state.filters.draft) {
      const draftBricks = this.props.finalBricks.filter(b => b.status !== BrickStatus.Publish);
      draft = draftBricks.length;
      bricks.push(...draftBricks);
    }
    if (this.state.filters.selfPublish) {
      const selfPublishBricks = this.props.finalBricks.filter(b => b.status === BrickStatus.Publish);
      selfPublish = selfPublishBricks.length;
      bricks.push(...selfPublishBricks);
    }

    let displayBricks = bricks;

    if (this.state.checkedSubjectId !== -1) {
      displayBricks = bricks.filter(b => b.subjectId === this.state.checkedSubjectId);
    }

    return (
      <Grid container direction="row" className="sorted-row personal-build">
        <FilterSidebar
          draft={draft}
          history={this.props.history}
          selfPublish={selfPublish}
          bricks={bricks}
          isEmpty={this.props.isFilterEmpty}
          filters={this.state.filters}
          setFilters={this.setFilters.bind(this)}
          filterBySubject={this.filterBySubject.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <Tab
            isTeach={this.props.isTeach}
            isCore={false}
            onCoreSwitch={this.props.toggleCore.bind(this)}
          />
            <div className="tab-content">
              {isEmpty && this.props.loaded
                ? this.renderEmptyPage()
                : <div className="bricks-list-container">
                    <div className="bricks-list">
                      {this.renderBricks(displayBricks)}
                    </div>
                  </div>}
              {this.renderPagination(displayBricks)}
            </div>
          </Grid>
        <DeleteBrickDialog
          isOpen={this.props.deleteDialogOpen}
          brickId={this.props.deleteBrickId}
          onDelete={(brickId: number) => this.props.delete(brickId)}
          close={() => this.props.handleDeleteClose()}
        />
      </Grid>
    );
  }
}

export default PersonalBuild;
