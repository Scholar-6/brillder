import React from "react";
import { Grid, Checkbox } from "@material-ui/core";
import { MUser } from "../../model";
import { UserSortBy } from '../ManageClassrooms';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface StudentTableProps {
  selectedUsers: MUser[];
  sortBy: UserSortBy;
  isAscending: boolean;
  pageStudentsSelected: boolean;

  sort(sortBy: UserSortBy): void;
  assignToClass(): void;
  togglePageStudents(): void;
}

const StudentTableHead: React.FC<StudentTableProps> = props => {
  const { sortBy, isAscending } = props;

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

  const renderAssignButton = () => {
    if (props.selectedUsers.length >= 1) {
      return (
        <div className="class-assign-button svgOnHover" onClick={props.assignToClass}>
          <SpriteIcon name="plus" className="active" />
        </div>
      )
    }
    return "";
  }

  return (
    <tr>
      <th className="user-radio-column">
        <Checkbox checked={props.pageStudentsSelected} onClick={props.togglePageStudents} />
      </th>
      <th className="user-full-name">
        <Grid container>
          NAME
          {renderSortArrow(UserSortBy.Name)}
        </Grid>
      </th>
      <th className="classes-names">
        <Grid container>CLASSES</Grid>
      </th>
      <th className="selected-column">
        {renderAssignButton()}
        <div className="selected-label svgOnHover">
          <span className="selected-count">{props.selectedUsers.length}</span>
          <SpriteIcon name="users-custom" className="active thin" />
          <span>Selected</span>
        </div>
      </th>
    </tr>
  );
}

export default StudentTableHead;
