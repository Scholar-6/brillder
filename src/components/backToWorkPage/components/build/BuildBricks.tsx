import React, { Component } from "react";

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { ThreeColumns } from '../../model';
import { prepareVisibleThreeColumnBricks } from '../../threeColumnService';
import { prepareVisibleBricks } from '../../service';
import PrivateCoreToggle from 'components/baseComponents/PrivateCoreToggle';

import BrickBlock from "components/baseComponents/BrickBlock";

interface BuildBricksProps {
  user: User;
  finalBricks: Brick[];
  threeColumns: ThreeColumns;

  shown: boolean;

  pageSize: number;
  sortedIndex: number;

  history: any;
  filters: any;
  toggleCore(): void;

  // brick events
  handleDeleteOpen(brickId: number): void;
  handleMouseHover(brickId: number): void;
  handleMouseLeave(brickId: number): void;
  onThreeColumnsMouseHover(brickId: number, status: BrickStatus): void;
  onThreeColumnsMouseLeave(brickId: number, status: BrickStatus): void;
}

class BuildBricks extends Component<BuildBricksProps> {
  renderGroupedBricks = (data: any[]) => {
    return data.map(item => {
      const {brick}: {brick: Brick} = item;
      let circleIcon = '';
      let iconColor = '';
      if (brick.editors && brick.editors.findIndex(e => e.id === this.props.user.id) >= 0) {
        circleIcon="edit-outline";
        iconColor = 'text-theme-dark-blue';
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
        handleDeleteOpen={brickId => this.props.handleDeleteOpen(brickId)}
        handleMouseHover={() => this.props.onThreeColumnsMouseHover(item.key, brick.status)}
        handleMouseLeave={() => this.props.onThreeColumnsMouseLeave(item.key, brick.status)}
      />
    });
  }

  renderSortedBricks = () => {
    const data = prepareVisibleBricks(this.props.sortedIndex, this.props.pageSize, this.props.finalBricks)

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
        handleDeleteOpen={brickId => this.props.handleDeleteOpen(brickId)}
        handleMouseHover={() => this.props.handleMouseHover(item.key)}
        handleMouseLeave={() => this.props.handleMouseLeave(item.key)}
      />
    });
  }

  renderBuildGroupedBricks = () => {
    const data = prepareVisibleThreeColumnBricks(this.props.pageSize, this.props.sortedIndex, this.props.threeColumns);
    return this.renderGroupedBricks(data);
  }

  renderBricks = () => {
    if (this.props.filters.viewAll) {
      return this.renderBuildGroupedBricks();
    }
    return this.renderSortedBricks();
  }

  render() {
    return (
      <div className="bricks-list-container">
        <PrivateCoreToggle
          isCore={this.props.filters.isCore}
          onSwitch={() => this.props.toggleCore()}
        />
        <div className="bricks-list">
          {this.renderBricks()}
        </div>
      </div>
    );
  }
}

export default BuildBricks;
