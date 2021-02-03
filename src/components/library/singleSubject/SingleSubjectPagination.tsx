import React from "react";
import { Grid } from "@material-ui/core";

import NextButton from "components/baseComponents/pagination/NextButton";
import PrevButton from "components/baseComponents/pagination/PrevButton";

interface PaginationProps {
  start: number;
  end: number;
  length: number;
  page: number;
  pages: number;
  next(): void;
  previous(): void;
}

const SingleSubjectPagination: React.FC<PaginationProps> = props => {
  const {page, pages} = props;
  if (pages <= 1) {
    return <div />;
  }
  return (
    <Grid container direction="row" className="bricks-pagination one-subject-pagination">
      <Grid item sm={4} className="left-pagination">
        <div className="first-row">
          {props.start}-{props.end}
          <span className="gray"> | {props.length}</span>
        </div>
        <div>
          {page}
          <span className="gray"> | {pages}</span>
        </div>
      </Grid>
      <Grid container item xs={4} justify="center">
        <div className="bottom-next-button">
          <PrevButton isShown={page > 0 ? true : false} onClick={props.previous} />
          <NextButton isShown={page < pages ? true : false} onClick={props.next} isRed={page === 1} />
        </div>
      </Grid>
    </Grid>
  );
}

export default SingleSubjectPagination;
