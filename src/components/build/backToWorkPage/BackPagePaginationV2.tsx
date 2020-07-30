import React from "react";
import { Grid } from "@material-ui/core";

import { ThreeColumns } from "./BackToWork";

import sprite from "assets/img/icons-sprite.svg";

interface BackPageTitleProps {
  sortedIndex: number;
  threeColumns: ThreeColumns;
  pageSize: number;
  moveBack(): void;
  moveNext(): void;
}

const BackPagePaginationV2: React.FC<BackPageTitleProps> = ({
  sortedIndex, threeColumns, pageSize, moveNext, moveBack
}) => {
  const getLongestColumn = () => {
    let draftLength = threeColumns.draft.finalBricks.length;
    let reviewLength = threeColumns.review.finalBricks.length;
    let publishLenght = threeColumns.publish.finalBricks.length;
    return Math.max(draftLength, reviewLength, publishLenght);
  }

  pageSize = pageSize / 3;
  const longest = getLongestColumn();
  const showPrev = sortedIndex >= pageSize;
  const showNext = sortedIndex + pageSize <= longest;

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
        <div>
          {(sortedIndex + pageSize) / pageSize}
          <span className="gray">
            {" "} &nbsp;|&nbsp; {Math.ceil(longest / pageSize)}
          </span>
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

export default BackPagePaginationV2;
