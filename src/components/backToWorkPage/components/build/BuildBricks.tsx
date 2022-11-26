import React, { Component } from "react";

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { prepareVisibleBricks } from '../../service';

import BrickBlock from "components/baseComponents/BrickBlock";
import BrickColDescription from "./BrickColDescription";
import PublishToggle from "./PublishToggle";
import CreateBrickBlock from "../CreateBrickBlock";
import EmptyPage from "./EmptyPage";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";

interface BuildBricksProps {
  user: User;
  finalBricks: Brick[];

  publishedCount: number;

  isCorePage: boolean;
  selectedSubjectId: number;

  loaded: boolean;
  shown: boolean;

  draftCount: number;
  buildCount: number;
  reviewCount: number;

  pageSize: number;
  sortedIndex: number;

  history: any;
  filters: any;

  searchString: string;

  moveNext(): void;
  moveBack(): void;

  // brick events
  handleDeleteOpen(brickId: number): void;
  handleMouseHover(brickId: number): void;
  handleMouseLeave(brickId: number): void;
}

interface State {
  bricksRef: React.RefObject<any>;
  onBricksWheel(e: any): void;
}

class BuildBricks extends Component<BuildBricksProps, State> {
  constructor(props: BuildBricksProps) {
    super(props);

    this.state = {
      bricksRef: React.createRef<any>(),
      onBricksWheel: this.onBricksWheel.bind(this)
    }
  }

  componentDidMount() {
    const { current } = this.state.bricksRef;
    if (current) {
      current.addEventListener('wheel', this.state.onBricksWheel, false);
    }
  }

  componentWillUnmount() {
    const { current } = this.state.bricksRef;
    if (current) {
      current.removeEventListener('wheel', this.state.onBricksWheel, false);
    }
  }

  onBricksWheel(e: any) {
    const wheelCoef = 40;
    if (e.wheelDeltaY < -wheelCoef) {
      this.props.moveNext();
    } else if (e.wheelDeltaY > wheelCoef) {
      this.props.moveBack();
    }
  }

  switchPublish() {
    this.props.history.push(map.BackToWorkPagePublished);
  }

  renderBricks = () => {
    const data = prepareVisibleBricks(this.props.sortedIndex, this.props.pageSize, this.props.finalBricks)

    return data.map(item => {
      const { brick } = item;
      let circleIcon = '';
      let iconColor = '';
      if (brick.editors && brick.editors.findIndex((e: any) => e.id === this.props.user.id) >= 0) {
        circleIcon = "edit-outline";
      }

      if (brick.isCreateLink) {
        return <CreateBrickBlock key={-10} history={this.props.history} isCore={this.props.isCorePage} />;
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

  renderRedDescription() {
    return (
      <div className="brick-container color1" style={{ width: '4vw' }}>
        <div className="absolute-container" style={{ width: '4vw' }}>
          <div className="short-description no-hover" style={{ width: '4vw' }}>
            <div className="brick-circle-container">
              <div className="left-brick-circle">
                <div className="round-button">{this.props.draftCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderYellowDescription() {
    return (
      <div className="brick-container color3" style={{ width: '4vw' }}>
        <div className="absolute-container" style={{ width: '4vw' }}>
          <div className="short-description no-hover" style={{ width: '4vw' }}>
            <div className="brick-circle-container">
              <div className="left-brick-circle">
                <div className="round-button">{this.props.buildCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderGreenDescription() {
    return (
      <div className="brick-container color2">
        <div className="absolute-container">
          <div className="short-description no-hover">
            <div className="brick-circle-container">

              <div className="left-brick-circle skip-top-right-border">
                <div className="round-button text-theme-green">{this.props.reviewCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderDescriptions() {
    if (this.props.filters.draft && !this.props.filters.review && !this.props.filters.build) {
      return (
        <div className="fixed-first-brick">
          <BrickColDescription label="Draft Bricks" color="color1" number={this.props.draftCount} />
        </div>
      );
    } else if (!this.props.filters.draft && !this.props.filters.review && this.props.filters.build) {
      return (
        <div className="fixed-first-brick">
          <BrickColDescription label="Submitted to Editor(s)" color="color3" number={this.props.buildCount} />;
        </div>
      );
    } else if (!this.props.filters.draft && this.props.filters.review && !this.props.filters.build) {
      return (
        <div className="fixed-first-brick">
          <BrickColDescription
            label="Pending Publication" color="color2"
            number={this.props.reviewCount} isGreen={true}
          />
        </div>
      );
    } else if (!this.props.filters.draft && this.props.filters.review && this.props.filters.build) {
      return (
        <div className="fixed-first-brick">
          <div className="main-brick-container description">
            {this.renderYellowDescription()}
            {this.renderGreenDescription()}
          </div>
        </div>
      );
    } else if (this.props.filters.draft && this.props.filters.review && !this.props.filters.build) {
      return (
        <div className="fixed-first-brick">
          <div className="main-brick-container description">
            {this.renderRedDescription()}
            {this.renderGreenDescription()}
          </div>
        </div>
      );
    } else if (this.props.filters.draft && !this.props.filters.review && this.props.filters.build) {
      return (
        <div className="fixed-first-brick">
          <div className="main-brick-container description">
            {this.renderRedDescription()}
            {this.renderYellowDescription()}
          </div>
        </div>
      );
    }
    return '';
  }

  render() {
    let isEmpty = false;

    if (this.props.finalBricks.length === 0 && this.props.selectedSubjectId === -1) {
      isEmpty = true;
    }

    if (isEmpty && this.props.loaded) {
      return <EmptyPage isPublish={this.props.filters.publish} published={this.props.publishedCount} switchPublish={this.switchPublish} />;
    }

    return (
      <div className="bricks-list-container">
        <PublishToggle
          isPublish={this.props.filters.publish}
          publishedCount={this.props.publishedCount}
          onSwitch={this.switchPublish}
        />
        <div className="bricks-list list" ref={this.state.bricksRef}>
          {this.renderDescriptions()}
          {!this.props.loaded && <div className="absolute-loader"><SpriteIcon name="f-loader" className="spinning" /></div>}
          {this.renderBricks()}
        </div>
      </div>
    );
  }
}

export default BuildBricks;
