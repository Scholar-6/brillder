import React, { Component } from "react";
import { Box, Grid } from "@material-ui/core";
import { Category } from "./service/interface";
import { Swiper, SwiperSlide } from "swiper/react";

import { Brick } from "model/brick";
import { getAssignmentIcon } from "components/services/brickService";

import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getBrickColor } from "services/brick";


interface ViewAllProps {
  sortedIndex: number;
  pageSize: number;
  finalBricks: Brick[];
  history: any;
  handleMobileClick(key: number): void;
  move(brickId: number): void;
}

class ViewAllMobile extends Component<ViewAllProps> {
  renderSortedMobileBrickContainer = (
    brick: Brick,
    key: number,
  ) => {
    const color = getBrickColor(brick);
    const circleIcon = getAssignmentIcon(brick);

    return (
      <div className="main-brick-container">
        <Box className="brick-container">
          <div
            className={`sorted-brick absolute-container brick-row-1 ${brick.expanded ? "brick-hover" : ""}`}
            onClick={() => this.props.handleMobileClick(key)}
          >
            <ShortBrickDescription
              brick={brick}
              color={color}
              circleIcon={circleIcon}
              isMobile={true}
              searchString=""
              isExpanded={brick.expanded}
              move={() => this.props.move(brick.id)}
            />
          </div>
        </Box>
      </div>
    );
  };

  renderSortedMobileBricks = () => {
    let bricksList = [];
    let i = 0;
    const { finalBricks } = this.props;
    for (let brick of finalBricks) {
      i++;
      bricksList.push(this.renderSortedMobileBrickContainer(brick, i));
    }
    return (
      <Swiper>
        {bricksList.map((b, i) => (
          <SwiperSlide key={i} style={{ width: "90vw" }}>
            {b}
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  render() {
    return (
      <Grid item xs={9} className="brick-row-container">
        <div
          className="brick-row-title"
          onClick={() => this.props.history.push(`/play/dashboard/${Category.New}`)}
        >
          <button className="btn btn-transparent svgOnHover">
            <span>New</span>
            <SpriteIcon name="arrow-right" className="active text-theme-dark-blue" />
          </button>
        </div>
        <div className="bricks-list-container bricks-container-mobile">
          <div className="bricks-list">{this.renderSortedMobileBricks()}</div>
        </div>
      </Grid>
    );
  }
}

export default ViewAllMobile;
