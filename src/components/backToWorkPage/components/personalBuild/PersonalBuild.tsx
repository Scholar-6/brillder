import React, { Component } from "react";

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { prepareVisibleBricks } from '../../service';

import BrickBlock from "components/baseComponents/BrickBlock";
import { Grid } from "@material-ui/core";
import FilterSidebar from "./FilterSidebar";
import Tab, { ActiveTab } from "../Tab";
import BackPagePagination from "../BackPagePagination";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import { PersonalFilters } from "./model";

interface PersonalBuildProps {
  user: User;
  finalBricks: Brick[];
  loaded: boolean;
  shown: boolean;
  pageSize: number;
  sortedIndex: number;
  history: any;
  isTeach: boolean;
  searchString: string;

  deleteDialogOpen: boolean;
  deleteBrickId: number;
  delete(brickId: number): void;
  handleDeleteClose(): void;

  toggleCore(): void;
  setTab(tab: ActiveTab): void;

  moveAllNext(): void;
  moveAllBack(): void;

  // brick events
  handleDeleteOpen(brickId: number): void;
  handleMouseHover(brickId: number): void;
  handleMouseLeave(brickId: number): void;
}


interface PersonalState {
  bricks: Brick[];
  filters: PersonalFilters;
}

class PersonalBuild extends Component<PersonalBuildProps, PersonalState> {
  constructor(props: PersonalBuildProps) {
    super(props);

    this.state = {
      bricks: this.props.finalBricks,
      filters: {
        draft: true,
        selfPublish: true
      }
    };
  }

  setFilters(filters: PersonalFilters) {
    this.setState({filters});
  }

  renderBricks = (bricks: Brick[]) => {
    const data = prepareVisibleBricks(this.props.sortedIndex, this.props.pageSize, bricks);

    return data.map(item => {
      return <BrickBlock
        brick={item.brick}
        index={item.index}
        row={item.row}
        user={this.props.user}
        key={item.index}
        shown={this.props.shown}
        history={this.props.history}
        circleIcon=''
        iconColor=''
        searchString={this.props.searchString}
        handleDeleteOpen={brickId => this.props.handleDeleteOpen(brickId)}
        handleMouseHover={() => this.props.handleMouseHover(item.key)}
        handleMouseLeave={() => this.props.handleMouseLeave(item.key)}
      />
    });
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

  render() {
    let isEmpty = false;

    if (this.props.finalBricks.length === 0) {
      isEmpty = true;
    }

    let draft = 0;
    let selfPublish = 0;
    let bricks:Brick[] = [];
    if (this.state.filters.draft) {
      const draftBricks = this.props.finalBricks.filter(b => b.status === BrickStatus.Draft || b.status === BrickStatus.Review || b.status === BrickStatus.Build);
      draft = draftBricks.length;
      bricks.push(...draftBricks);
    } else if (this.state.filters.selfPublish) {
      const selfPublishBricks = this.props.finalBricks.filter(b => b.status === BrickStatus.Publish);
      selfPublish = selfPublishBricks.length;
      bricks.push(...selfPublishBricks);
    }

    return (
      <Grid container direction="row" className="sorted-row personal-build">
        <FilterSidebar
          draft={draft}
          selfPublish={selfPublish}
          bricks={bricks}
          filters={this.state.filters}
          setFilters={this.setFilters.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <Tab
            isTeach={this.props.isTeach}
            activeTab={ActiveTab.Build}
            isCore={false}
            onCoreSwitch={this.props.toggleCore.bind(this)}
            setTab={this.props.setTab}
          />
            <div className="tab-content">
              {isEmpty && this.props.loaded
                ? this.renderEmptyPage()
                : <div className="bricks-list-container">
                    <div className="bricks-list">
                      {this.renderBricks(bricks)}
                    </div>
                  </div>}
            {this.renderPagination(bricks)}
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
