import React, { Component } from "react";
import queryString from "query-string";

import {
  AcademicLevel,
  AcademicLevelLabels,
  Brick,
  BrickLengthEnum,
  Subject,
} from "model/brick";
import { User } from "model/user";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getBrickColor } from "services/brick";
import { searchPublicBricks } from "services/axios/brick";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";
import PhoneExpandedBrick from "./components/PhoneExpandedBrick";
import { hideZendesk, showZendesk } from "services/zendesk";
import {
  isLevelVisible,
  isLengthVisible,
  toggleElement,
} from "./service/viewAll";
import { hideKeyboard } from "components/services/key";
import map from "components/map";

interface BricksListProps {
  user: User;
  subjects: Subject[];
  history: any;
  requestFailed(e: string): void;
}

interface BricksListState {
  typingTimeout: number;

  expandedBrick: Brick | null;
  bricks: Array<Brick>;
  searchString: string;
  finalBricks: Brick[];
  filterLevels: AcademicLevel[];
  filterLength: BrickLengthEnum[];
  isLoading: boolean;
  isEmpty: boolean;
  inputRef: React.RefObject<any>;
}

class PhoneSearchPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    const values = queryString.parse(props.history.location.search);
    const searchString = (values.searchString as string) || "";

    hideZendesk();

    this.state = {
      typingTimeout: -1,

      expandedBrick: null,
      bricks: [],
      finalBricks: [],
      searchString: searchString,
      inputRef: React.createRef<any>(),
      filterLevels: [],
      filterLength: [],
      isLoading: false,
      isEmpty: false,
    };
  }

  moveBack() {
    showZendesk();
    this.props.history.push(map.ViewAllPage);
  }

  async search(searchString: string) {
    if (searchString && searchString.length < 3) {
      return '';
    }
    this.setState({ isLoading: true });
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    const typingTimeout = setTimeout(async () => {
      let isEmpty = false;
      const bricks = await searchPublicBricks(searchString);
      if (bricks) {
        if (bricks.length === 0) {
          isEmpty = true;
        }
        const finalBricks = this.filter(
          bricks,
          this.state.filterLevels,
          this.state.filterLength
        );
        this.setState({ bricks, finalBricks, isEmpty, isLoading: false });
      } else {
        this.props.requestFailed("Can`t get search bricks");
        this.setState({isLoading: false});
      }
    }, 1000);
    this.setState({typingTimeout})
    //this.setState({ isLoading: false });
  }

  filter(bricks: Brick[], levels: AcademicLevel[], lengths: BrickLengthEnum[]) {
    const finalBricks = [];
    for (let b of bricks) {
      if (isLevelVisible(b, levels)) {
        if (isLengthVisible(b, lengths)) {
          finalBricks.push(b);
        }
      }
    }
    return finalBricks;
  }

  filterByLevel(level: AcademicLevel) {
    const { filterLevels } = this.state;
    const levels = toggleElement(filterLevels, level);
    const finalBricks = this.filter(
      this.state.bricks,
      levels,
      this.state.filterLength
    );
    this.setState({ filterLevels: levels, finalBricks });
  }

  filterByLength(length: BrickLengthEnum) {
    const { filterLength } = this.state;
    const lengths = toggleElement(filterLength, length);
    const finalBricks = this.filter(
      this.state.bricks,
      this.state.filterLevels,
      lengths
    );
    this.setState({ filterLength: lengths, finalBricks });
  }

  renderAcademicLevel(level: AcademicLevel) {
    const isActive = !!this.state.filterLevels.find((l) => l === level);
    return (
      <div
        className={`va-round-level ${isActive ? "active" : ""}`}
        onClick={() => this.filterByLevel(level)}
      >
        {AcademicLevelLabels[level]}
      </div>
    );
  }

  renderBrickLengthBox(length: number) {
    const isActive = !!this.state.filterLength.find((l) => l === length);
    return (
      <div
        className={`va-round-level ${isActive ? "active" : ""}`}
        onClick={() => this.filterByLength(length)}
      >
        {length}
      </div>
    );
  }

  hideKeyboard() {
    const { current } = this.state.inputRef;
    hideKeyboard(current);
  }

  renderContent() {
    const {finalBricks} = this.state;
    if (this.state.searchString === "") {
      return (
        <div className="ba-content empty">
          <div>
            <p>Start typing</p>
            <p>to see results</p>
          </div>
        </div>
      );
    }
    if (this.state.isEmpty === true) {
      return (
        <div className="ba-content empty">
          <div>
            <p>Sorry, no bricks found</p>
          </div>
        </div>
      );
    }
    if (this.state.isLoading === false && finalBricks.length === 0) {
      return (
        <div className="ba-content empty">
          <div>
            <p>There are some bricks.</p>
            <p>Try to unselect all filters</p>
          </div>
        </div>
      );
    }
    let text = '';
    if (finalBricks.length === 1) {
      text = `${finalBricks.length} brick found`;
    } else if (finalBricks.length > 1) {
      text = `${finalBricks.length} bricks found`;
    }
    return (
      <div className="ba-content full" onScroll={this.hideKeyboard.bind(this)}>
        <span className="bold ff-found-text">{text}</span>
        {finalBricks.map((b, i) => {
          const color = getBrickColor(b as Brick);
          return (
            <PhoneTopBrick16x9
              key={i}
              circleIcon=""
              brick={b}
              color={color}
              onClick={() => {
                this.setState({ expandedBrick: b });
              }}
            />
          );
        })}
        {this.state.expandedBrick && this.state.expandedBrick.title && (
          <PhoneExpandedBrick
            brick={this.state.expandedBrick}
            history={this.props.history}
            hide={() => this.setState({ expandedBrick: null })}
          />
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="mobile-search-page">
        <div className="ba-top-navigation">
          <SpriteIcon name="arrow-left" onClick={() => this.moveBack()} />
          <div onClick={() => this.moveBack()}>Go Back</div>
        </div>
        <div className="ba-search-input-container">
          <SpriteIcon name="search" />
          <input
            ref={this.state.inputRef}
            value={this.state.searchString}
            onChange={(e) => {
              this.setState({ searchString: e.target.value });
              this.search(e.target.value);
            }}
            placeholder="Search for Subjects, Topics, Titles and more..."
          />
          {this.state.isLoading && (
            <div className="loader-container spinning">
              <SpriteIcon name="f-loader" />
            </div>
          )}
        </div>
        <div className="ba-filters">
          <div className="ba-filter-box">
            <div className="ba-filter">
              {this.renderAcademicLevel(AcademicLevel.First)}
              {this.renderAcademicLevel(AcademicLevel.Second)}
              {this.renderAcademicLevel(AcademicLevel.Third)}
              {this.renderAcademicLevel(AcademicLevel.Fourth)}
            </div>
            <div className="ba-label">Level</div>
          </div>
          <div className="ba-filter-box ba-right-box">
            <div className="ba-filter">
              {this.renderBrickLengthBox(BrickLengthEnum.S20min)}
              {this.renderBrickLengthBox(BrickLengthEnum.S40min)}
              {this.renderBrickLengthBox(BrickLengthEnum.S60min)}
            </div>
            <div className="ba-label">Length</div>
          </div>
        </div>
        {this.renderContent()}
      </div>
    );
  }
}

export default PhoneSearchPage;
