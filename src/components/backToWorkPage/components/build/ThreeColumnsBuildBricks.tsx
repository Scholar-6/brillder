import React, { Component } from "react";

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { prepareVisibleThreeColumnBricks } from '../../threeColumnService';

import BrickBlock from "components/baseComponents/BrickBlock";
import BrickColDescription from "./BrickColDescription";
import PublishToggle from "./PublishToggle";
import CreateBrickBlock from "../CreateBrickBlock";
import EmptyPage from "./EmptyPage";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface BuildBricksProps {
  user: User;
  threeColumns: any;

  publishedCount: number;

  isCorePage: boolean;

  loaded: boolean;
  shown: boolean;

  page: number;
  pageSize: number;

  history: any;
  filters: any;

  searchString: string;

  switchPublish(): void;

  moveNext(): void;
  moveBack(): void;

  // brick events
  handleDeleteOpen(brickId: number): void;
}

interface State {
  bricksRef: React.RefObject<any>;
}

class BuildBricks extends Component<BuildBricksProps, State> {
  constructor(props: BuildBricksProps) {
    super(props);

    this.state = {
      bricksRef: React.createRef<any>(),
    }
  }

  renderGroupedBricks = (data: any[]) => {
    return data.map((item, i) => {
      const { brick }: { brick: Brick } = item;
      let circleIcon = '';
      let iconColor = '';
      if (brick.editors && brick.editors.findIndex(e => e.id === this.props.user.id) >= 0) {
        circleIcon = "edit-outline";
      }

      //#2238 bricks returned to author have repeat icon in build
      if (brick.status === BrickStatus.Draft && brick.editors && brick.editors.length > 0) {
        circleIcon = "repeat";
      }

      if (brick.isEmptyColumn) {
        switch (brick.columnStatus) {
          case BrickStatus.Draft:
            return this.renderFirstEmptyColumn();
          case BrickStatus.Build:
            return this.renderSecondEmptyColumn();
          case BrickStatus.Review:
            return this.renderThirdEmptyColumn();
        }
      }

      if (brick.isCreateLink) {
        return <CreateBrickBlock key={-10} history={this.props.history} isCore={this.props.isCorePage} />;
      }

      // render first row as description
      if (this.props.loaded) {
        const { threeColumns } = this.props;
        if (i === 0) {
          return <BrickColDescription key={item.key} label="Draft Bricks" color="color1" number={threeColumns.red.count} />;
        } else if (i === 1) {
          return <BrickColDescription key={item.key} label="Submitted to Editor(s)" color="color3" number={threeColumns.yellow.count} />;
        } else if (i === 2) {
          return <BrickColDescription key={item.key} label="Pending Publication" color="color2" number={threeColumns.green.count} isGreen={true} />;
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
        handleMouseHover={() => {}}
        handleMouseLeave={() => {}}
      />
    });
  }

  renderBricks = () => {
    const data = prepareVisibleThreeColumnBricks(this.props.page, this.props.threeColumns, this.props.loaded);
    return this.renderGroupedBricks(data);
  }

  renderFirstEmptyColumn() {
    return (
      <div className="main-brick-container empty-description first" key={-12}>
        <div>
          <div className="centered">
            <div className="circle b-red"></div>
          </div>
          <div className="bold empty-title">Bricks in this column are draft bricks.</div>
          <div className="italic">
            They will appear here once you have begun a
            plan, or when an editor has reviewed and
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

  render() {
    let isEmpty = false;

    const { threeColumns } = this.props;

    if (threeColumns.red.count === 0 && threeColumns.green.count === 0 && threeColumns.yellow.count === 0) {
      isEmpty = true;
    }

    if (isEmpty && this.props.loaded) {
      return <EmptyPage isPublish={this.props.filters.publish} published={this.props.publishedCount} switchPublish={this.props.switchPublish} />;
    }

    return (
      <div className="bricks-list-container">
        <PublishToggle
          isPublish={this.props.filters.publish}
          publishedCount={this.props.publishedCount}
          onSwitch={this.props.switchPublish}
        />
        <div className="bricks-list three-columns" ref={this.state.bricksRef}>
          {!this.props.loaded && <div className="absolute-loader"><SpriteIcon name="f-loader" className="spinning" /></div>}
          {this.renderBricks()}
        </div>
      </div>
    );
  }
}

export default BuildBricks;
