import React from "react";
import { Grid, Radio } from "@material-ui/core";

import sprite from "assets/img/icons-sprite.svg";

import { MUser } from "../../interface";
import { UserSortBy } from '../ManageClassrooms';

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
        <div className="class-assign-button" onClick={props.assignToClass}>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#plus"} />
          </svg>
        </div>
      )
    }
    return "";
  }

  const renderUserTableHead = () => {
    return (
      <tr>
        <th className="subject-title">SC</th>
        <th className="user-full-name" style={{ width: '20%' }}>
          <Grid container>
            NAME
            {renderSortArrow(UserSortBy.Name)}
          </Grid>
        </th>
        <th style={{ width: '29%' }}>
          <Grid container>
            CLASSES
            {renderSortArrow(UserSortBy.Name)}
          </Grid>
        </th>
        <th style={{ padding: 0, width: '20%' }}>
          <Grid container className="selected-column">
            <Radio checked={props.pageStudentsSelected} onClick={props.togglePageStudents} />
            {renderAssignButton()}
            <div className="selected-label">
              <span className="selected-count">{props.selectedUsers.length}</span>
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#users"} />
              </svg>
              Selected
            </div>
          </Grid>
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
                    {user.studyClassrooms ? user.studyClassrooms.map((classroom, i) =>
                      <div key={i} className="classroom-name">{classroom.name}</div>) : ""
                    }
                  </div>
                </td>
                <td className="user-radio-column">
                  <div style={{ display: 'flex' }}>
                    <Radio checked={user.selected} onClick={() => props.toggleUser(user.id)} />
                    <div className="action-buttons">
                    <div className="edit-button">
                      <svg className="svg">
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#edit-outline"} />
                      </svg>
                    </div>
                    {props.isClassroom ? 
                    <div className="trash-button" onClick={() => props.unassign(user)}>
                      <svg className="svg">
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#trash-outline"} />
                      </svg>
                    </div> : ""
                    }
                    </div>
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
