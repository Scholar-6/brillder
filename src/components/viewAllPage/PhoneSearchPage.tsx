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
import { hideZendesk } from "services/zendesk";
import {
  isLevelVisible,
  isLengthVisible,
  toggleElement,
} from "./service/viewAll";

interface BricksListProps {
  user: User;
  subjects: Subject[];
  history: any;
  location: any;
  requestFailed(e: string): void;
  moveBack(): void;
}

interface BricksListState {
  expandedBrick: Brick | null;
  bricks: Array<Brick>;
  searchString: string;
  finalBricks: Brick[];
  filterLevels: AcademicLevel[];
  filterLength: BrickLengthEnum[];
  isLoading: boolean;
  isEmpty: boolean;
}

class PhoneSearchPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    const values = queryString.parse(props.location.search);
    const searchString = (values.searchString as string) || "";

    hideZendesk();

    this.state = {
      expandedBrick: null,
      bricks: [],
      finalBricks: [],
      searchString: searchString,
      filterLevels: [],
      filterLength: [],
      isLoading: false,
      isEmpty: false,
    };
  }

  async search(searchString: string) {
    this.setState({ isLoading: true });
    let isEmpty = false;
    const bricks = await searchPublicBricks(searchString);
    if (bricks) {
      if (bricks.length === 0) {
        isEmpty = true;
      }
      const finalBricks = this.filter(bricks, this.state.filterLevels, this.state.filterLength);
      this.setState({ bricks, finalBricks, isEmpty });
    } else {
      this.props.requestFailed("Can`t get search bricks");
    }
    this.setState({ isLoading: false });
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
    /*
    const element = document.createElement('input');
    document.body.appendChild(element);
    element.focus();
    element.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
    element.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
    setTimeout(function() {
        element.blur();  //actually close the keyboard
        // Remove readonly attribute after keyboard is hidden.
        element.removeAttribute('readonly');
        element.removeAttribute('disabled');
    }, 100);*/
  }

  renderContent() {
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
    if (this.state.isLoading === false && this.state.finalBricks.length === 0) {
      return (
        <div className="ba-content empty">
          <div>
            <p>There are some bricks.</p>
            <p>Try to unselect all filters</p>
          </div>
        </div>
      );
    }
    return (
      <div className="ba-content full" onScroll={this.hideKeyboard}>
        {this.state.finalBricks.map((b, i) => {
          const color = getBrickColor(b as Brick);
          return (
            <PhoneTopBrick16x9
              circleIcon=""
              brick={b}
              index={i}
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
          <SpriteIcon name="arrow-left" onClick={() => this.props.moveBack()} />
          <div onClick={() => this.props.moveBack()}>Go Back</div>
        </div>
        <div className="ba-search-input-container">
          <SpriteIcon name="search" />
          <input
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
