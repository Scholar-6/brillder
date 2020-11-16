import React from "react";
import { Grid, } from "@material-ui/core";
import { User } from "model/user";
import NextButton from "components/baseComponents/pagination/NextButton";
import PrevButton from "components/baseComponents/pagination/PrevButton";


interface UsersListProps {
  totalCount: number;
  users: User[];
  page: number;
  pageSize: number;
  nextPage(): void;
  previousPage(): void;
}

const UsersListPagination:React.FC<UsersListProps> = props => {
  const { totalCount, users, page, pageSize } = props;
  const showPrev = page > 0;
  const currentPage = page;
  const showNext = totalCount / pageSize - currentPage > 1;
  const prevCount = currentPage * pageSize;
  const minUser = prevCount + 1;
  const maxUser = prevCount + users.length;
  
  return (
    <div className="users-pagination">
      <Grid container direction="row">
        <Grid item xs={4} className="left-pagination">
          <div className="first-row">
            {minUser}-{maxUser}
            <span className="gray"> &nbsp;|&nbsp; {totalCount}</span>
          </div>
          <div>
            {page + 1}
            <span className="gray">
              {" "}
              &nbsp;|&nbsp; {Math.ceil(totalCount / pageSize)}
            </span>
          </div>
        </Grid>
        <Grid item xs={4} className="bottom-next-button">
          <div>
            <PrevButton isShown={showPrev} onClick={props.previousPage} />
            <NextButton isShown={showNext} onClick={props.nextPage} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default UsersListPagination;
