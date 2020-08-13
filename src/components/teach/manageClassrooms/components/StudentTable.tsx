import React from "react";
import { Grid, Radio } from "@material-ui/core";

import sprite from "assets/img/icons-sprite.svg";

import { User } from "model/user";
import { UserSortBy } from '../ManageClassrooms';

interface StudentTableProps {
  users: User[];
  selectedUsers: User[];

  sortBy: UserSortBy;
  isAscending: boolean;

  toggleUser(i: number): void;
  sort(sortBy: UserSortBy): void;
  assignToClass(): void;
}

const StudentTable: React.FC<StudentTableProps> = props => {
  const { users, sortBy, isAscending } = props;

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
        <th className="email-column" style={{ width: '27%' }}>EMAIL</th>
        <th style={{ width: '29%' }}>
          <Grid container>
            CLASSES
            {renderSortArrow(UserSortBy.Name)}
          </Grid>
        </th>
        <th style={{ padding: 0 }}>
          <Grid container className="selected-column">
            <Radio disabled={true} />
            <span className="selected-count">{props.selectedUsers.length}</span>
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#users"} />
            </svg>
            Selected
          </Grid>
        </th>
        <th className="edit-button-column"></th>
      </tr>
    );
  }

  const renderAssignButton = () => {
    return (
      <div className="class-assign-button" onClick={props.assignToClass}>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#plus"} />
        </svg>
        <div>Add to...</div>
      </div>
    )
  }
  if (!users) {
    return <div></div>;
  }
  return (
    <div className="users-table">
      <table cellSpacing="0" cellPadding="0">
        <thead>{renderUserTableHead()}</thead>
        <tbody>
          {users.map((user: any, i: number) => {
            return (
              <tr className="user-row" key={i}>
                <td></td>
                <td>
                  <span className="user-first-name">{user.firstName} </span>
                  <span className="user-last-name">{user.lastName}</span>
                </td>
                <td>{user.email}</td>
                <td></td>
                <td className="user-radio-column">
                  <div style={{display: 'flex'}}>
                    <div>
                      <Radio checked={user.selected} onClick={() => props.toggleUser(i)} />
                    </div>
                    {user.selected ? renderAssignButton() : ""}
                  </div>
                </td>
                <td className="activate-button-container"></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
