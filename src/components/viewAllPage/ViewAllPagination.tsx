import React from "react";
import { Grid } from "@material-ui/core";

import NextButton from "components/baseComponents/pagination/NextButton";
import PrevButton from "components/baseComponents/pagination/PrevButton";

const DashboardPagination: React.FC<any> = props => {
  const { pageSize, sortedIndex, bricksLength } = props;

  if (bricksLength <= pageSize) return <div></div>;

  const showPrev = sortedIndex >= pageSize;
  const showNext = sortedIndex + pageSize <= bricksLength - 1;

  let firstBrickIndex = sortedIndex + 1;
  let lastBrickIndex = sortedIndex + pageSize;
  if (sortedIndex + pageSize > bricksLength) {
    lastBrickIndex = bricksLength;
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
          <PrevButton isShown={showPrev} onClick={props.moveAllBack} />
          <NextButton isShown={showNext} onClick={props.moveAllNext} isRed={sortedIndex === 0} />
        </div>
      </Grid>
    </Grid>
  );
}

export default DashboardPagination;
