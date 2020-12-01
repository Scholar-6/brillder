import React from "react";
import { Grid } from "@material-ui/core";

import NextButton from "components/baseComponents/pagination/NextButton";
import PrevButton from "components/baseComponents/pagination/PrevButton";

interface BackPageTitleProps {
  sortedIndex: number;
  pageSize: number;
  longestColumn: number;
  isRed?: boolean;
  moveBack(): void;
  moveNext(): void;
}

const BackPagePaginationV2: React.FC<BackPageTitleProps> = ({
  sortedIndex, longestColumn, pageSize, isRed, moveNext, moveBack
}) => {
  pageSize = pageSize / 3;
  const showPrev = sortedIndex >= pageSize;
  const showNext = sortedIndex + pageSize < longestColumn;

  return (
    <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
      <Grid container direction="row" className="bricks-pagination">
        <Grid item xs={4} className="left-pagination">
          <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
            {(sortedIndex + pageSize) / pageSize}
            <span className="gray">
              {" "} &nbsp;|&nbsp; {Math.ceil(longestColumn / pageSize)}
            </span>
          </div>
        </Grid>
        <Grid item xs={4} className="bottom-next-button">
          <div>
            <PrevButton isShown={showPrev} onClick={moveBack} />
            <NextButton isShown={showNext} isRed={isRed} onClick={moveNext} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default BackPagePaginationV2;
