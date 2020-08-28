import React from "react";
import { Grid } from "@material-ui/core";

import { ThreeColumns } from "../model";

import NextButton from "components/baseComponents/pagination/NextButton";
import PrevButton from "components/baseComponents/pagination/PrevButton";

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
    let draftLength = threeColumns.red.finalBricks.length;
    let reviewLength = threeColumns.yellow.finalBricks.length;
    let publishLenght = threeColumns.green.finalBricks.length;
    return Math.max(draftLength, reviewLength, publishLenght);
  }

  pageSize = pageSize / 3;
  const longest = getLongestColumn();
  const showPrev = sortedIndex >= pageSize;
  const showNext = sortedIndex + pageSize <= longest;

  return (
    <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
      <Grid container direction="row" className="bricks-pagination">
        <Grid item xs={4} className="left-pagination">
          <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
            {(sortedIndex + pageSize) / pageSize}
            <span className="gray">
              {" "} &nbsp;|&nbsp; {Math.ceil(longest / pageSize)}
            </span>
          </div>
        </Grid>
        <Grid item xs={4} className="bottom-next-button">
          <div>
            <PrevButton isShown={showPrev} onClick={moveBack} />
            <NextButton isShown={showNext} onClick={moveNext} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default BackPagePaginationV2;
