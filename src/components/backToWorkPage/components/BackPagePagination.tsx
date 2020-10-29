import React from "react";
import { Grid } from "@material-ui/core";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface BackPageTitleProps {
  sortedIndex: number;
  bricksLength: number;
  pageSize: number;
  isRed?: boolean;
  moveBack(): void;
  moveNext(): void;
}

const BackPagePagination: React.FC<BackPageTitleProps> = ({
  sortedIndex, bricksLength, pageSize, isRed, moveNext, moveBack
}) => {
  if (bricksLength <= pageSize) {
    return <span></span>;
  }

  const showPrev = sortedIndex >= pageSize;
  const showNext = sortedIndex + pageSize < bricksLength;

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
      let className = 'btn btn-transparent next-button svgOnHover';
      if (showNext) {
        className += ' active';

        if (isRed) {
          className += ' text-orange';
        }
      }
      return (
        <button className={className} onClick={() => moveNext()}>
          <SpriteIcon name="arrow-down" className="w100 h100 active" />
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
          <SpriteIcon name="arrow-up" className="w100 h100 active" />
        </button>
      );
    }
    return "";
  }

  return (
    <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
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
    </div>
  );
}

export default BackPagePagination;
