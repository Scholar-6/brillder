import React from "react";
import { Grid } from "@material-ui/core";

import sprite from "assets/img/icons-sprite.svg";

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
        <button
          className={"btn btn-transparent next-button svgOnHover " + (showNext ? "active" : "")}
          onClick={() => moveNext()}>
          <svg className="svg w100 h100 active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#arrow-down"} />
          </svg>
        </button>
      );
    }
    return "";
  }

  const renderBackButton = () => {
    if (showPrev) {
      return (
        <button className={"btn btn-transparent prev-button svgOnHover " + (showPrev ? "active" : "")}
          onClick={() => moveBack()}>
          <svg className="svg w100 h100 active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#arrow-up"} />
          </svg>
        </button>
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
      <Grid item xs={4} className="bottom-next-button">
        <div>
          {renderBackButton()}
          {renderNextButton()}
        </div>
      </Grid>
    </Grid>
  );
}

export default BackPagePagination;
