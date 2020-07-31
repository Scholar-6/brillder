import React from "react";
import { Grid } from "@material-ui/core";

import sprite from "assets/img/icons-sprite.svg";


interface BricksListProps {
  pageSize: number;
  sortedIndex: number;
  bricksLength: number;
  moveAllBack(): void;
  moveAllNext(): void;
}

const DashboardPagination: React.FC<any> = ({ ...props }) => {
  const { pageSize, sortedIndex, bricksLength } = props;

  if (bricksLength <= pageSize) return <div></div>;

  const showPrev = sortedIndex >= pageSize;
  const showNext = sortedIndex + pageSize <= bricksLength;

  let firstBrickIndex = sortedIndex + 1;
  let lastBrickIndex = sortedIndex + pageSize;
  if (sortedIndex + pageSize > bricksLength) {
    lastBrickIndex = bricksLength;
  }

  const renderPrevButton = () => {
    return (
      <button className={"btn btn-transparent prev-button svgOnHover " + (showPrev ? "active" : "")}
        onClick={() => props.moveAllBack()}>
        <svg className="svg w100 h100 active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#arrow-up"} />
        </svg>
      </button>
    );
  }

  const renderNextButton = () => {
    return (
      <button
        className={"btn btn-transparent next-button svgOnHover " + (showNext ? "active" : "")}
        onClick={() => props.moveAllNext()}>
        <svg className="svg w100 h100 active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#arrow-down"} />
        </svg>
      </button>
    );
  }

  return (
    <Grid container direction="row" className="bricks-pagination">
      <Grid item sm={4} className="left-pagination">
        <div className="first-row">
          {firstBrickIndex}-{lastBrickIndex}
          <span className="gray"> | {bricksLength}</span>
        </div>
        <div>
          {(sortedIndex + pageSize) / pageSize}
          <span className="gray"> | {Math.ceil(bricksLength / pageSize)}</span>
        </div>
      </Grid>
      <Grid container item xs={4} justify="center">
        <div className="bottom-next-button">
          {showPrev ? renderPrevButton() : ""}
          {showNext ? renderNextButton() : ""}
        </div>
      </Grid>
    </Grid>
  );
}

export default DashboardPagination;
