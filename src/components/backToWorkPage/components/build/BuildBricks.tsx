import React, { Component } from "react";

import { Brick, BrickStatus } from "model/brick";
import { User } from "model/user";
import { ThreeColumns } from '../../model';
import { prepareVisibleThreeColumnBricks } from '../../threeColumnService';
import { prepareVisibleBricks } from '../../service';

import BrickBlock from "components/baseComponents/BrickBlock";
import BrickColDescription from "./BrickColDescription";
import PublishToggle from "./PublishToggle";
import CreateBrickBlock from "../CreateBrickBlock";

interface BuildBricksProps {
  user: User;
  finalBricks: Brick[];
  threeColumns: ThreeColumns;

  isCorePage: boolean;

  loaded: boolean;
  shown: boolean;

  pageSize: number;
  sortedIndex: number;
  published: number;

  history: any;
  filters: any;

  searchString: string;

  switchPublish(): void;

  moveNext(): void;
  moveBack(): void;

  // brick events
  handleDeleteOpen(brickId: number): void;
  handleMouseHover(brickId: number): void;
  handleMouseLeave(brickId: number): void;
  onThreeColumnsMouseHover(brickId: number, status: BrickStatus): void;
  onThreeColumnsMouseLeave(brickId: number, status: BrickStatus): void;
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
    const {current} = this.state.bricksRef;
    if (current) {
      current.addEventListener('wheel', this.state.onBricksWheel, false);
    }
  }

  componentWillUnmount() {
    const {current} = this.state.bricksRef;
    if (current) {
      current.removeEventListener('wheel', this.state.onBricksWheel, false);
    }
  }

  onBricksWheel(e: any) {
    const wheelCoef = 40;
    if (e.wheelDeltaY < -wheelCoef) {
      this.props.moveNext();
    } else if (e.wheelDeltaY > wheelCoef){
      this.props.moveBack();
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
          return <BrickColDescription key={item.key} label="Draft Bricks" color="color1" number={threeColumns.red.finalBricks.length - 1} />;
        } else if (i === 1) {
          return <BrickColDescription key={item.key} label="Submitted to Editor(s)" color="color3" number={threeColumns.yellow.finalBricks.length} />;
        } else if (i === 2) {
          return <BrickColDescription key={item.key} label="Pending Publication" color="color2" number={threeColumns.green.finalBricks.length} isGreen={true} />;
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
        handleMouseHover={() => {
          this.props.onThreeColumnsMouseHover(item.key, brick.status)
        }}
        handleMouseLeave={() => this.props.onThreeColumnsMouseLeave(item.key, brick.status)}
      />
    });
  }

  renderSortedBricks = () => {
    const data = prepareVisibleBricks(this.props.sortedIndex, this.props.pageSize - 1, this.props.finalBricks)
    data.unshift({brick: {isCreateLink: true} as Brick});

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

  isThreeColumnsEmpty = () => {
    const { threeColumns } = this.props;
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

  isThreeColumns() {
    const { filters } = this.props;
    return !filters.publish && filters.build && filters.review && filters.draft;
  }

  renderBricks = () => {
    if (this.isThreeColumns()) {
      return this.renderBuildGroupedBricks();
    }
    return this.renderSortedBricks();
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

  renderEmptyPage() {
    return (
      <div className="bricks-list-container no-top-padding">
        <PublishToggle
          isPublish={this.props.filters.publish}
          publishedCount={this.props.published}
          onSwitch={this.props.switchPublish}
        />
        <div className="bricks-list">
          {this.renderFirstEmptyColumn()}
          {this.renderSecondEmptyColumn()}
          {this.renderThirdEmptyColumn()}
        </div>
      </div>
    );
  }

  renderRedDescription() {
    let count = 0;
    for (let b of this.props.finalBricks) {
      if (b.status === BrickStatus.Draft && b.isCore === true) {
        count++;
      }
    }
    return (
      <div className="brick-container color1" style={{ width: '4vw' }}>
        <div className="absolute-container" style={{ width: '4vw' }}>
          <div className="short-description no-hover" style={{ width: '4vw' }}>
          <div className="brick-circle-container">
            <div className="left-brick-circle">
              <div className="round-button">{count}</div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderYellowDescription() {
    let count = 0;
    for (let b of this.props.finalBricks) {
      if (b.status === BrickStatus.Build && b.isCore === true) {
        count++;
      }
    }
    return (
      <div className="brick-container color3" style={{ width: '4vw' }}>
        <div className="absolute-container" style={{ width: '4vw' }}>
          <div className="short-description no-hover" style={{ width: '4vw' }}>
            <div className="brick-circle-container">
              <div className="left-brick-circle">
                <div className="round-button">{count}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderGreenDescription() {
    let count = 0;
    for (let b of this.props.finalBricks) {
      if (b.status === BrickStatus.Review && b.isCore === true) {
        count++;
      }
    }
    return (
      <div className="brick-container color2">
        <div className="absolute-container">
          <div className="short-description no-hover">
          <div className="brick-circle-container">

            <div className="left-brick-circle skip-top-right-border">
              <div className="round-button text-theme-green">{count}</div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderDescriptions() {
    if (this.props.filters.draft && !this.props.filters.review && !this.props.filters.build) {
      let count = 0;
      for (let b of this.props.finalBricks) {
        if (b.status === BrickStatus.Draft && b.isCore === true) {
          count++;
        }
      }
      return (
        <div className="fixed-first-brick">
          <BrickColDescription label="Draft Bricks" color="color1" number={count} />
        </div>
      );
    } else if (!this.props.filters.draft && !this.props.filters.review && this.props.filters.build) {
      let count = 0;
      for (let b of this.props.finalBricks) {
        if (b.status === BrickStatus.Build && b.isCore === true) {
          count++;
        }
      }
      return (
        <div className="fixed-first-brick">
          <BrickColDescription label="Submitted to Editor(s)" color="color3" number={count} />;
        </div>
      );
    } else if (!this.props.filters.draft && this.props.filters.review && !this.props.filters.build) {
      let count = 0;
      for (let b of this.props.finalBricks) {
        if (b.status === BrickStatus.Review && b.isCore === true) {
          count++;
        }
      }
      return (
        <div className="fixed-first-brick">
          <BrickColDescription label="Pending Publication" color="color2" number={count} isGreen={true} />
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
        <div className={`bricks-list ${this.isThreeColumns() ? 'three-columns' : 'list'}`} ref={this.state.bricksRef}>
          {!this.isThreeColumns() && this.renderDescriptions()}
          {this.renderBricks()}
        </div>
      </div>
    );
  }
}

export default BuildBricks;
