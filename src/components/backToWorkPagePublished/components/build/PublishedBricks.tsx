import React, { Component } from "react";

import { Brick } from "model/brick";
import { User } from "model/user";
import { prepareVisibleBricks } from '../../service';

import BrickBlock from "components/baseComponents/BrickBlock";
import PublishToggle from "./PublishToggle";
import EmptyPage from "./EmptyPage";
import BackPagePagination from "../BackPagePagination";

interface BuildBricksProps {
  user: User;
  finalBricks: Brick[];

  loaded: boolean;
  shown: boolean;

  pageSize: number;
  sortedIndex: number;
  published: number;

  history: any;
  filters: any;

  searchString: string;

  switchPublish(): void;

  moveNext(pageSize: number): void;
  moveBack(pageSize: number): void;

  // brick events
  handleDeleteOpen(brickId: number): void;
  handleMouseHover(brickId: number): void;
  handleMouseLeave(brickId: number): void;
}

interface State {
  bricksRef: React.RefObject<any>;
}

class PublishBricks extends Component<BuildBricksProps, State> {
  constructor(props: BuildBricksProps) {
    super(props);

    this.state = {
      bricksRef: React.createRef<any>(),
    }
  }

  renderSortedBricks = () => {
    const data = prepareVisibleBricks(this.props.sortedIndex, this.props.pageSize, this.props.finalBricks)

    return data.map(item => {
      const { brick } = item;
      let circleIcon = '';
      let iconColor = '';
      if (brick.editors && brick.editors.findIndex((e: any) => e.id === this.props.user.id) >= 0) {
        circleIcon = "edit-outline";
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

  renderPagination() {
    const { finalBricks } = this.props;
    let { sortedIndex, pageSize } = this.props;

    return (
      <BackPagePagination
        sortedIndex={sortedIndex}
        pageSize={pageSize}
        isRed={sortedIndex === 0}
        bricksLength={finalBricks.length}
        moveNext={() => this.props.moveNext(pageSize)}
        moveBack={() => this.props.moveBack(pageSize)}
      />
    );
  }

  render() {
    let isEmpty = false;

    if (this.props.finalBricks.length === 0) {
      isEmpty = true;
    }

    if (isEmpty && this.props.loaded) {
      return <div className="publish-bricks">
        <EmptyPage isPublish={this.props.filters.publish} published={this.props.published} switchPublish={this.props.switchPublish} />
      </div>
    }

    return (
      <div className="tab-content">
        <div className="bricks-list-container">
          <PublishToggle
            isPublish={this.props.filters.publish}
            publishedCount={this.props.published}
            onSwitch={this.props.switchPublish}
          />
          <div className="bricks-list list published" ref={this.state.bricksRef}>
            {this.renderSortedBricks()}
          </div>
        </div>
        {this.renderPagination()}
      </div>
    );
  }
}

export default PublishBricks;
