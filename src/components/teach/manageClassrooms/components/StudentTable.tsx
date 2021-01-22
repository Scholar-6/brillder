import React from "react";
import { Grid, Radio } from "@material-ui/core";

import { MUser } from "../../model";
import { UserSortBy } from '../ManageClassrooms';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface StudentTableProps {
  users: MUser[];
  selectedUsers: MUser[];
  isClassroom: boolean;

  sortBy: UserSortBy;
  isAscending: boolean;
  pageStudentsSelected: boolean;

  toggleUser(userId: number): void;
  sort(sortBy: UserSortBy): void;
  assignToClass(): void;
  unassign(student: MUser): void;
  togglePageStudents(): void;
}

const StudentTable: React.FC<StudentTableProps> = props => {
  const { users, sortBy, isAscending } = props;

  if (!users) {
    return <div></div>;
  }

  const renderSortArrow = (currentSortBy: UserSortBy) => {
    return (
      <img
        className="sort-button"
        alt=""
        src={
          sortBy === currentSortBy
            ? !isAscending
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

  const renderUserTableHead = () => {
    return (
      <tr>
        <th className="subject-title">SC</th>
        <th className="user-full-name">
          <Grid container>
            NAME
            {renderSortArrow(UserSortBy.Name)}
          </Grid>
        </th>
        <th className="classes-names">
          <Grid container>
            CLASSES
            {renderSortArrow(UserSortBy.Name)}
          </Grid>
        </th>
        <th className="user-radio-column">
          <Radio checked={props.pageStudentsSelected} onClick={props.togglePageStudents} />
        </th>
        <th className="selected-column">
          {renderAssignButton()}
          <div className="selected-label svgOnHover">
            <span className="selected-count">{props.selectedUsers.length}</span>
            <SpriteIcon name="users" className="active" />
            <span>Selected</span>
          </div>
        </th>
      </tr>
    );
  }

  return (
    <div className="users-table">
      <table cellSpacing="0" cellPadding="0">
        <thead>{renderUserTableHead()}</thead>
        <tbody>
          {users.map((user, i) => {
            return (
              <tr className="user-row" key={i}>
                <td></td>
                <td>
                  <span className="user-first-name">{user.firstName} </span>
                  <span className="user-last-name">{user.lastName}</span>
                </td>
                <td>
                  <div className="classroom-names">
                    {user.studyClassrooms && user.studyClassrooms.map((classroom, i) =>
                      <div key={i} className="classroom-name" style={{
                        backgroundColor: classroom.subject?.color
                      }}>{classroom.name}</div>)
                    }
                  </div>
                </td>
                <td className="user-radio-column">
                  <Radio checked={user.selected} onClick={() => props.toggleUser(user.id)} />
                </td>
                <td className="selected-column">
                  <div className="action-buttons">
                    <div className="edit-button svgOnHover">
                      <SpriteIcon name="edit-outline" className="active" />
                    </div>
                    {props.isClassroom &&
                      <div className="trash-button svgOnHover" onClick={() => props.unassign(user)}>
                        <SpriteIcon name="trash-outline" className="active" />
                      </div>
                    }
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
