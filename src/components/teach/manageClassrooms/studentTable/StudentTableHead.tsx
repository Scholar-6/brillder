import React from "react";
import { Grid, Checkbox } from "@material-ui/core";
import { MUser } from "../../model";
import { UserSortBy } from '../ManageClassrooms';

interface StudentTableProps {
  selectedUsers: MUser[];
  sortBy: UserSortBy;
  isAscending: boolean;
  pageStudentsSelected: boolean;
  isClassroom?: boolean;

  sort(sortBy: UserSortBy): void;
  togglePageStudents(): void;
}

const StudentTableHead: React.FC<StudentTableProps> = props => {
  const { sortBy, isAscending } = props;

  const [allHovered, setAllHover] = React.useState(false);

  const onHover = () => {
    if (!allHovered) {
      setAllHover(true);
    }
  }
  
  const onBlur = () => {
    setAllHover(false);
  }

  const renderSortArrow = (currentSortBy: UserSortBy) => {
    return (
      <img
        className="sort-button"
        alt=""
        src={
          sortBy === currentSortBy
            ? isAscending
              ? "/feathericons/chevron-down.svg"
              : "/feathericons/chevron-up.svg"
            : "/feathericons/chevron-right.svg"
        }
        onClick={() => props.sort(currentSortBy)}
      />
    );
  }

  return (
    <div className="students-table-head">
      <div className="user-radio-column">
        <Checkbox onMouseOver={onHover} onMouseLeave={onBlur} checked={props.pageStudentsSelected} onClick={props.togglePageStudents} />
        {allHovered && <div className="custom-tooltip">Select All</div>}
      </div>
      <div className={`user-full-name ${props.isClassroom ? " bigger" : ""}`}>
        <Grid container>
          Name
          {renderSortArrow(UserSortBy.Name)}
        </Grid>
      </div>
      {!props.isClassroom &&
      <div className="classes-names">
        <Grid container>Classes</Grid>
      </div>}
      <div className="selected-column">
      </div>
    </div>
  );
}

export default StudentTableHead;
