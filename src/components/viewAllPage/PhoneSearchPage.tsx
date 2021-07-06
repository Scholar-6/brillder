import React, { Component } from "react";
import queryString from "query-string";

import { AcademicLevel, AcademicLevelLabels, Brick, BrickLengthEnum, Subject } from "model/brick";
import { User } from "model/user";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getBrickColor } from "services/brick";
import { searchPublicBricks } from "services/axios/brick";
import routes from "components/play/routes";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";
import PhoneExpandedBrick from "./components/PhoneExpandedBrick";
import { hideZendesk } from "services/zendesk";


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
      filterLength: []
    };
  }

  moveToPlay(brickId: number) {
    this.props.history.push(routes.phonePrep(brickId));
  }

  move(brickId: number) {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen().then(() => {
        this.moveToPlay(brickId);
      });
    } else {
      this.moveToPlay(brickId);
    }
  }

  async search(searchString: string) {
    const bricks = await searchPublicBricks(searchString);
    if (bricks) {
      this.setState({ bricks, finalBricks: bricks });
    } else {
      this.props.requestFailed("Can`t get search bricks");
    }
  }

  isLevelVisible(brick: Brick, levels: AcademicLevel[]) {
    if (levels.length > 0) {
      return !!levels.find(l => l === brick.academicLevel);
    }
    return true;
  }

  toggleElement(arr: any[], value: any) {
    const found = arr.find((l) => l === value);
    if (found) {
      arr = arr.filter((l) => l !== value);
    } else {
      arr.push(value);
    }
    return arr;
  }

  filterByLevel(level: AcademicLevel) {
    const { filterLevels } = this.state;
    const levels = this.toggleElement(filterLevels, level);
    this.setState({ filterLevels: levels });
  }

  filterByLength(length: BrickLengthEnum) {
    const { filterLength } = this.state;
    const lengths = this.toggleElement(filterLength, length)
    this.setState({ filterLength: lengths });
  }

  renderAcademicLevel(level: AcademicLevel) {
    const isActive = !!this.state.filterLevels.find(l => l === level);
    return (
      <div className={`va-round-level ${isActive ? 'active' : ''}`} onClick={() => this.filterByLevel(level)}>
        {AcademicLevelLabels[level]}
      </div>
    );
  }

  renderBrickLengthBox(length: number) {
    const isActive = !!this.state.filterLength.find(l => l === length);
    return (
      <div className={`va-round-level ${isActive ? 'active' : ''}`} onClick={() => this.filterByLength(length)}>
        {length}
      </div>
    )
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
          <input value={this.state.searchString} onChange={e => {
            this.setState({ searchString: e.target.value });
            this.search(e.target.value);
          }} placeholder="Search for Subjects, Topics, Titles and more..." />
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
        {this.state.searchString === ''
          ? <div className="ba-content empty">
            <div>
              <p>Start typing</p>
              <p>to see results</p>
            </div>
          </div>
          : <div className="ba-content full">
            {this.state.finalBricks.map((b, i) => {
               const color = getBrickColor(b as Brick);
               return (
                 <PhoneTopBrick16x9
                   circleIcon=""
                   brick={b}
                   index={i}
                   color={color}
                   onClick={() => {
                     this.setState({expandedBrick: b});
                   }}
                 />
               );
            })}
            {this.state.expandedBrick && <PhoneExpandedBrick brick={this.state.expandedBrick} history={this.props.history} hide={() => this.setState({expandedBrick: null})} />}
          </div>
        }
      </div>
    );
  }
}

export default PhoneSearchPage;
