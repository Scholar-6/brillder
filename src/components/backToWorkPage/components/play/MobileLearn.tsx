import React, { Component } from "react";
import { Box, Grid, Grow } from "@material-ui/core";
import { Swiper, SwiperSlide } from 'swiper/react';

import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";
import { User } from "model/user";
import { getAssignmentIcon } from "components/services/brickService";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import PrivateCoreToggle from "components/baseComponents/PrivateCoreToggle";
import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";
import ExpandedMobileBrick from "components/baseComponents/ExpandedMobileBrickDescription";

interface Props {
  history: any;
  assignments: AssignmentBrick[];
  isCore: boolean;
  shown: boolean;
  user: User;

  onCoreSwitch(): void;
  handleClick(i: number): void;
}

class MobileLearn extends Component<Props> {
  getColor(item: AssignmentBrick) {
    if (item.status === AssignmentBrickStatus.ToBeCompleted) {
      return 'color1';
    } else if (item.status === AssignmentBrickStatus.SubmitedToTeacher) {
      return 'color2';
    } else if (item.status === AssignmentBrickStatus.CheckedByTeacher) {
      return 'color3';
    }
    return '';
  }

  moveToPlay(a: AssignmentBrick) {
    this.props.history.push(`/play/brick/${a.brick.id}/intro?assignmentId=${a.id}`);
  }

  renderExpandedBrick(a: AssignmentBrick) {
    let color = this.getColor(a);

    return (
      <ExpandedMobileBrick
        brick={a.brick}
        circleClass={color}
        color={color}
        move={() => this.moveToPlay(a)}
        hide={() => {}}
      />
    );
  }

  renderMobileBricks() {
    const {assignments} = this.props;
    let expandedBrick = assignments.find(a => a.brick.expanded === true);

    if (expandedBrick) {
      return this.renderExpandedBrick(expandedBrick);
    }
    let bricksList = [];
    for (let i = 0; i < assignments.length; i++) {
      const brick = assignments[i].brick;
      if (brick) {
        const color = this.getColor(assignments[i]);
        const circleIcon = getAssignmentIcon(brick);
        bricksList.push(
          <ShortBrickDescription
            circleIcon={circleIcon}
            circleClass={color}
            searchString=""
            brick={brick} index={i}
            color={color}
          />
        );
      }
    }

    return (
      <Swiper slidesPerView={2}>
        {bricksList.map((b, i) => 
          <SwiperSlide key={i} onClick={() => this.props.handleClick(i)} style={{ width: '50vw' }}>
            {b}
          </SwiperSlide>
        )}
      </Swiper>
    );
  }

  renderBrick = (a: AssignmentBrick, key: number) => {
    const color = this.getColor(a);
    const circleIcon = getAssignmentIcon(a.brick);
    let className = 'sorted-brick absolute-container';

    if (a.brick.expanded) {
      className += " brick-hover";
    }
    
    return (
      <Grow
        in={this.props.shown}
        style={{ transformOrigin: "0 0 0" }}
        timeout={key * 150}
      >
        <div key={key} className="main-brick-container">
          <Box className="brick-container">
            <div className={className} onClick={() => this.props.handleClick(key)}>
              <ShortBrickDescription
                brick={a.brick}
                color={color}
                circleClass={color}
                isMobile={true}
                circleIcon={circleIcon}
                isExpanded={a.brick.expanded}
                searchString=""
                move={() => this.moveToPlay(a)}
              />
            </div>
          </Box>
        </div>
      </Grow>
    );
  };

  renderSortedBricks = (assignments: AssignmentBrick[]) => {
    let bricksList = [];
    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i]) {
        bricksList.push(this.renderBrick(assignments[i], i));
      }
    }
    return bricksList;
  };

  render() {
    const {history} = this.props;
    return (
      <div className="main-listing dashboard-page mobile-category learn-mobile-tab">
        <div className="page-navigation">
          <div className="btn btn-transparent glasses svgOnHover">
            <SpriteIcon name="glasses" className="w100 h100 active text-theme-dark-blue" />
          </div>
          <div className="breadcrumbs">New</div>
        </div>
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          placeholder={"Search Ongoing Projects & Published Bricks…"}
          history={history}
          search={() => {}}
          searching={(v: string) => {}}
        />
        <div className="mobile-scroll-bricks">
          {this.renderMobileBricks()}
        </div>
        <Grid container direction="row" className="sorted-row">
          <Grid item xs={9} className="brick-row-container">
            <div className="brick-row-title">
              <button className="btn btn-transparent svgOnHover">
                <span>Learn</span>
                <PrivateCoreToggle isCore={this.props.isCore} onSwitch={this.props.onCoreSwitch} />
              </button>
            </div>
            <div className="bricks-list-container">
              {this.renderSortedBricks(this.props.assignments)}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default MobileLearn;
