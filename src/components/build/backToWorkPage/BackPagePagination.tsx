import React from "react";
import { Grid } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import { } from "./BackToWork";

interface BackPageTitleProps {
  sortedIndex: number;
  bricksLength: number;
  pageSize: number;
  moveBack(): void;
  moveNext(): void;
}

const BackPagePagination: React.FC<BackPageTitleProps> = ({
  sortedIndex, bricksLength, pageSize, moveNext, moveBack
}) => {
  if (bricksLength <= pageSize) {
    return <span></span>;
  }

  const showPrev = sortedIndex >= pageSize;
  const showNext = sortedIndex + pageSize <= bricksLength;

  const getBricksRange = () => {
    let maxRange = sortedIndex + pageSize;
    if (sortedIndex + pageSize > bricksLength) {
      maxRange = bricksLength;
    }
    let range = `${sortedIndex + 1}-${maxRange}`;
    return range
  }

  const renderNextButton = () => {
    if (showNext) {
      return (
        <ExpandMoreIcon
          className={"next-button " + (showNext ? "active" : "")}
          onClick={() => moveNext()}
        />
      );
    }
    return "";
  }

  const renderBackButton = () => {
    if (showPrev) {
      return (
        <ExpandLessIcon
          className={"prev-button " + (showPrev ? "active" : "")}
          onClick={() => moveBack()}
        />
      );
    }
    return "";
  }

  return (
    <Grid container direction="row" className="bricks-pagination">
      <Grid item xs={4} className="left-pagination">
        <div className="first-row">
          {getBricksRange()}
          <span className="gray">{" "} &nbsp;|&nbsp; {bricksLength}</span>
        </div>
        <div>
          {(sortedIndex + pageSize) / pageSize}
          <span className="gray">{" "} &nbsp;|&nbsp; {Math.ceil(bricksLength / pageSize)}</span>
        </div>
      </Grid>
      <Grid container item xs={4} justify="center" className="bottom-next-button">
        <div>
          {renderBackButton()}
          {renderNextButton()}
        </div>
      </Grid>
    </Grid>
  );
}

export default BackPagePagination;
