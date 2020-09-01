import React, { Component } from "react";

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { ThreeColumns } from '../../model';
import { prepareVisibleThreeColumnBricks } from '../../threeColumnService';
import { prepareVisibleBricks } from '../../service';
import PrivateCoreToggle from 'components/baseComponents/PrivateCoreToggle';
import BrickList from '../BrickList';

import BrickBlock from '../BrickBlock';

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
      return <BrickBlock
        brick={item.brick}
        index={item.key}
        row={item.row}
        key={item.key}
        user={this.props.user}
        shown={this.props.shown}
        history={this.props.history}
        handleDeleteOpen={brickId => this.props.handleDeleteOpen(brickId)}
        handleMouseHover={() => this.props.onThreeColumnsMouseHover(item.key, item.brick.status)}
        handleMouseLeave={() => this.props.onThreeColumnsMouseLeave(item.key, item.brick.status)}
      />
    });
  }

  renderSortedBricks = () => {
    const data = prepareVisibleBricks(this.props.sortedIndex, this.props.pageSize, this.props.finalBricks)

    return <BrickList
      data={data} shown={this.props.shown}
      user={this.props.user} history={this.props.history}
      handleDeleteOpen={this.props.handleDeleteOpen.bind(this)}
      handleMouseHover={this.props.handleMouseHover.bind(this)}
      handleMouseLeave={this.props.handleMouseLeave.bind(this)}
    />
  };

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
