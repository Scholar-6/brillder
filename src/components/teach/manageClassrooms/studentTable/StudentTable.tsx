import React from "react";
import { Checkbox } from "@material-ui/core";
import { Grow } from "@material-ui/core";

import { MUser } from "../../model";
import { UserSortBy } from '../ManageClassrooms';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import StudentTableHead from "./StudentTableHead";

import './StudentTable.scss';

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

  const [rerender, setRerender] = React.useState(false);

  if (!users) {
    return <div></div>;
  }

  const onHover = (user: MUser) => {
    for (const u of users) {
      user.selectHovered = false;
    }
    if (!user.selectHovered) {
      user.selectHovered = true;
      setRerender(!rerender);
    }
  }

  const onBlur = (user: MUser) => {
    user.selectHovered = false;
    setRerender(!rerender);
  }

  const onDragStart = (e: React.DragEvent<HTMLTableRowElement>) => {
    let count = 0;
    let studentIds: Number[] = [];
    for (let student of users) {
      if (student.selected) {
        studentIds.push(student.id);
        count += 1;
      }
    }
    var elem = document.createElement("div");
    elem.id = "student-drag-element";
    elem.innerHTML = "Dragging " + count + ' students';
    elem.style.position = "absolute";
    elem.style.top = "-1000px";
    document.body.appendChild(elem);
    e.dataTransfer.setDragImage(elem, 0, 0);
    e.dataTransfer.setData("text/plain", JSON.stringify({ studentIds }));
  }

  const renderStudent = (user: MUser, i: number) => {
    return (
      <Grow
        in={true}
        key={i}
        style={{ transformOrigin: "left 0 0" }}
        timeout={i * 200}
      >
      <div draggable={true} onDragStart={onDragStart} className={user.hasInvitation ? "user-row yellow" : "user-row"} key={i}>
        <div className="user-radio-column">
          <Checkbox
            checked={user.selected}
            onMouseOver={() => onHover(user)} onMouseLeave={() => onBlur(user)}
            onClick={() => props.toggleUser(user.id)} />
          {user.selectHovered && <div className="custom-tooltip">Select</div>}
        </div>
        <div className="student-name">
          {user.hasInvitation
            ? <div className="user-email">{user.email}</div>
            : <div>
              <span className="user-first-name">{user.firstName} </span>
              <span className="user-last-name">{user.lastName}</span>
            </div>}
        </div>
        <div className="classroom-names">
          <div>
            {user.studyClassrooms && user.studyClassrooms.map((classroom, i) =>
              <div key={i} className="classroom-name" style={{
                backgroundColor: classroom.subject?.color
              }}>{classroom.name}</div>)
            }
            {user.hasInvitation && <div key={i} className="classroom-name text-theme-dark-blue pending-label">Pending</div>}
          </div>
        </div>
        <div className="selected-column">
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
        </div>
      </div>
      </Grow>
    );
  }

  return (
    <div className="users-table">
      <StudentTableHead
        selectedUsers={props.selectedUsers}
        sortBy={sortBy}
        isAscending={isAscending}
        pageStudentsSelected={props.pageStudentsSelected}
        sort={props.sort}
        assignToClass={props.assignToClass}
        togglePageStudents={props.togglePageStudents}
      />
      {users.map(renderStudent)}
    </div>
  );
}

export default StudentTable;
