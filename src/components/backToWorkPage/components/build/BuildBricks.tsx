import React, { Component } from "react";

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { ThreeColumns } from '../../model';
import { prepareVisibleThreeColumnBricks } from '../../threeColumnService';
import { prepareVisibleBricks } from '../../service';

import BrickBlock from "components/baseComponents/BrickBlock";
import BrickColDescription from "./BrickColDescription";
import PublishToggle from "./PublishToggle";

interface BuildBricksProps {
  user: User;
  finalBricks: Brick[];
  threeColumns: ThreeColumns;

  loaded: boolean;
  shown: boolean;

  pageSize: number;
  sortedIndex: number;
  published: number;

  history: any;
  filters: any;

  searchString: string;

  switchPublish(): void;


  // brick events
  handleDeleteOpen(brickId: number): void;
  handleMouseHover(brickId: number): void;
  handleMouseLeave(brickId: number): void;
  onThreeColumnsMouseHover(brickId: number, status: BrickStatus): void;
  onThreeColumnsMouseLeave(brickId: number, status: BrickStatus): void;
}

class BuildBricks extends Component<BuildBricksProps> {
  renderGroupedBricks = (data: any[]) => {
    return data.map((item, i) => {
      const {brick}: {brick: Brick} = item;
      let circleIcon = '';
      let iconColor = '';
      if (brick.editors && brick.editors.findIndex(e => e.id === this.props.user.id) >= 0) {
        circleIcon="edit-outline";
        iconColor = 'text-theme-dark-blue';
      }

      if (brick.isEmptyColumn) {
        switch(brick.columnStatus) {
          case BrickStatus.Draft:
            return this.renderFirstEmptyColumn();
          case BrickStatus.Build:
            return this.renderSecondEmptyColumn();
          case BrickStatus.Review:
            return this.renderThirdEmptyColumn();
        }
      }

      // render first row as description
      if (this.props.loaded) {
        const {threeColumns} = this.props;
        if (i === 0 ) {
          return <BrickColDescription key={item.key} label="Draft Bricks" color="color1" number={threeColumns.red.finalBricks.length} />;
        } else if (i === 1) {
          return <BrickColDescription key={item.key} label="Submitted to Editor(s)" color="color3" number={threeColumns.yellow.finalBricks.length} />;
        } else if (i === 2) {
          return <BrickColDescription key={item.key} label="Pending Publication" color="color2" number={threeColumns.green.finalBricks.length} isGreen={true}/>;
        }
      }

      return <BrickBlock
        brick={brick}
        index={item.key}
        row={item.row}
        key={item.key}
        circleIcon={circleIcon}
        iconColor={iconColor}
        user={this.props.user}
        shown={this.props.shown}
        history={this.props.history}
        searchString={this.props.searchString}
        handleDeleteOpen={brickId => this.props.handleDeleteOpen(brickId)}
        handleMouseHover={() => this.props.onThreeColumnsMouseHover(item.key, brick.status)}
        handleMouseLeave={() => this.props.onThreeColumnsMouseLeave(item.key, brick.status)}
      />
    });
  }

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
        searchString={this.props.searchString}
        handleDeleteOpen={brickId => this.props.handleDeleteOpen(brickId)}
        handleMouseHover={() => this.props.handleMouseHover(item.key)}
        handleMouseLeave={() => this.props.handleMouseLeave(item.key)}
      />
    });
  }

  isThreeColumnsEmpty = () => {
    const {threeColumns} = this.props;
    if (threeColumns.green.finalBricks.length > 0) {
      return false;
    } else if (threeColumns.red.finalBricks.length > 0) {
      return false;
    } else if (threeColumns.yellow.finalBricks.length > 0) {
      return false;
    }
    return true;
  }

  renderBuildGroupedBricks = () => {
    const data = prepareVisibleThreeColumnBricks(this.props.pageSize, this.props.sortedIndex, this.props.threeColumns, this.props.loaded);
    return this.renderGroupedBricks(data);
  }

  renderBricks = () => {
    if (this.props.filters.viewAll) {
      return this.renderBuildGroupedBricks();
    }
    return this.renderSortedBricks();
  }

  renderFirstEmptyColumn() {
    return (
      <div className="main-brick-container empty-description first" key={-2}>
        <div>
          <div className="centered">
            <div className="circle b-red"></div>
          </div>
          <div className="bold empty-title">Bricks in this column are draft bricks.</div>
          <div className="italic">
            They will appear here once you have begun a
            proposal, or when an editor has reviewed and
            returned your brick to you.
          </div>
        </div>
      </div>
    );
  }

  renderSecondEmptyColumn() {
    return (
      <div className="main-brick-container empty-description second" key={-3}>
        <div>
          <div className="centered">
            <div className="circle b-yellow"></div>
          </div>
          <div className="bold empty-title">Bricks in this column are with editors.</div>
          <div className="italic">
            They will appear here once you have played a
            preview of your brick and invited an editor to
            suggest changes to it.
          </div>
        </div>
      </div>
    );
  }

  renderThirdEmptyColumn() {
    return (
      <div className="main-brick-container empty-description third" key={-4}>
        <div>
          <div className="centered">
            <div className="circle yellow-in-green centered">
              <div className="circle b-white"></div>
            </div>
          </div>
          <div className="bold empty-title">Bricks in this column are with publishers.</div>
          <div className="italic">
            They will appear here once your editor(s) approve(s) your brick and sends it to the Publisher.
          </div>
          <div className="last-text italic">
            You will receive a notification if your brick is published, and it will appear in the Public Library.
          </div>
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
          {this.renderThirdEmptyColumn()}
        </div>
      </div>
    );
  }

  render() {
    let isEmpty = false;

    if (this.props.finalBricks.length === 0) {
      isEmpty = true;
    }

    if (isEmpty && this.props.loaded) {
      return this.renderEmptyPage();
    }

    return (
      <div className="bricks-list-container">
        <PublishToggle
          isPublish={this.props.filters.publish}
          publishedCount={this.props.published}
          onSwitch={this.props.switchPublish}
        />
        <div className="bricks-list">
          {this.renderBricks()}
        </div>
      </div>
    );
  }
}

export default BuildBricks;
