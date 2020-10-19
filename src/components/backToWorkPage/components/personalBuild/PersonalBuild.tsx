import React, { Component } from "react";

import { Brick } from "model/brick";
import { User } from "model/user";
import { prepareVisibleBricks } from '../../service';

import BrickBlock from "components/baseComponents/BrickBlock";
import { Grid } from "@material-ui/core";
import FilterSidebar from "./FilterSidebar";
import Tab, { ActiveTab } from "../Tab";
import BackPagePagination from "../BackPagePagination";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";

interface BuildBricksProps {
  user: User;
  finalBricks: Brick[];
  loaded: boolean;
  shown: boolean;
  pageSize: number;
  sortedIndex: number;
  history: any;
  isTeach: boolean;

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

class PersonalBuild extends Component<BuildBricksProps> {
  renderSortedBricks = () => {
    const data = prepareVisibleBricks(this.props.sortedIndex, this.props.pageSize + 3, this.props.finalBricks)

    return data.map(item => {
      const {brick} = item;
      let circleIcon = '';
      let iconColor = '';
      if (brick.editor && brick.editor.id === this.props.user.id) {
        circleIcon="edit-outline";
        iconColor = 'text-theme-dark-blue';
      }
      
      return <BrickBlock
        brick={item.brick}
        index={item.index}
        row={item.row}
        user={this.props.user}
        key={item.index}
        shown={this.props.shown}
        history={this.props.history}
        circleIcon={circleIcon}
        iconColor={iconColor}
        searchString=''
        handleDeleteOpen={brickId => this.props.handleDeleteOpen(brickId)}
        handleMouseHover={() => this.props.handleMouseHover(item.key)}
        handleMouseLeave={() => this.props.handleMouseLeave(item.key)}
      />
    });
  }

  renderBricks = () => {
    return this.renderSortedBricks();
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
        pageSize={pageSize+3}
        bricksLength={finalBricks.length}
        moveNext={() => this.props.moveAllNext()}
        moveBack={() => this.props.moveAllBack()}
      />
    );
  }

  render() {
    const {finalBricks} = this.props;
    let isEmpty = false;

    if (this.props.finalBricks.length === 0) {
      isEmpty = true;
    }

    return (
      <Grid container direction="row" className="sorted-row personal-build">
        <FilterSidebar bricks={this.props.finalBricks} />
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
                      {this.renderBricks()}
                    </div>
                  </div>}
            {this.renderPagination(finalBricks)}
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
