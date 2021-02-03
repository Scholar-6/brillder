import React from "react";
import { Grid } from "@material-ui/core";

import NextButton from "components/baseComponents/pagination/NextButton";
import PrevButton from "components/baseComponents/pagination/PrevButton";

interface PaginationProps {
  length: number;
  page: number;
  pages: any[];
  next(): void;
  previous(): void;
}

const SingleSubjectPagination: React.FC<PaginationProps> = props => {
  const { page, pages } = props;
  if (pages.length <= 1) {
    return <div />;
  }

  let startIndex = 1;
  let endIndex = 0;
  let i = 1;
  for (let pageContent of pages) {
    if (i < page) {
      startIndex += pageContent.length;
    }
    if (i <= page) {
      endIndex += pageContent.length;
    }
    i++;
  }

  return (
    <Grid container direction="row" className="bricks-pagination one-subject-pagination">
      <Grid item sm={4} className="left-pagination">
        <div className="first-row">
          {startIndex}-{endIndex} <span className="gray"> | {props.length}</span>
        </div>
        <div>
          {page} <span className="gray"> | {pages.length}</span>
        </div>
      </Grid>
      <Grid container item xs={4} justify="center">
        <div className="bottom-next-button">
          <PrevButton isShown={page > 0 ? true : false} onClick={props.previous} />
          <NextButton isShown={page < pages.length ? true : false} onClick={props.next} isRed={page === 1} />
        </div>
      </Grid>
    </Grid>
  );
}

export default SingleSubjectPagination;
