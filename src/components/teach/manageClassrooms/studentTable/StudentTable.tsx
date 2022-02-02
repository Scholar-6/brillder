import React from "react";
import { Checkbox } from "@material-ui/core";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { Grow } from "@material-ui/core";

import { MUser } from "../../model";
import { UserSortBy } from '../ManageClassrooms';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import StudentTableHead from "./StudentTableHead";

import './StudentTable.scss';
import map from "components/map";
import ClassroomNames from "./ClassroomNames";
import { ClassroomApi } from "components/teach/service";

interface StudentTableProps {
  history: any;
  users: MUser[];
  selectedUsers: MUser[];
  isClassroom?: boolean;
  isAdmin: boolean;

  sortBy: UserSortBy;
  isAscending: boolean;
  pageStudentsSelected: boolean;
  isPending?: boolean;

  toggleUser(userId: number): void;
  sort(sortBy: UserSortBy): void;
  unassign(student: MUser): void;
  togglePageStudents(): void;
  resendInvitation(email: string, classroom?: ClassroomApi): void;
}

const StudentTable: React.FC<StudentTableProps> = props => {
  const { users, sortBy, isAscending } = props;

  const [rerender, setRerender] = React.useState(false);

  if (!users) {
    return <div></div>;
  }

  const onHover = (user: MUser) => {
    for (const u of users) {
      u.selectHovered = false;
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

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, student: MUser) => {
    if (!student.selected) {
      props.toggleUser(student.id);
    }

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
    elem.innerHTML = "Move " + count + ' students';
    elem.style.position = "absolute";
    elem.style.top = "-1000px";
    document.body.appendChild(elem);
    e.dataTransfer.setDragImage(elem, 0, 0);
    e.dataTransfer.setData("text/plain", JSON.stringify({ studentIds }));
  }

  const renderLibraryLink = (user: MUser) => {
    let name = '';
    const { firstName } = user;
    if (!firstName) {
      return '';
    }
    let lastLetter = firstName[firstName.length - 1];
    if (lastLetter === 's') {
      name = firstName + "'";
    } else {
      name = firstName + "'s";
    }
    return (
      <div className="student-library-link" onClick={() => props.history.push(map.MyLibrary + '/' + user.id)}>
        <SpriteIcon name="bar-chart-2" />
        <div className="css-custom-tooltip">View {name} library</div>
      </div>
    );
  }

  const renderStudent = (user: MUser, i: number) => {
    let className = 'user-row';
    if (user.hasInvitation) {
      className += ' yellow';
    }
    if (user.selected) {
      className += ' selected';
    }
    return (
      <Grow
        in={true}
        key={i}
        style={{ transformOrigin: "left 0 0" }}
        timeout={i * 200}
      >
        <div draggable={true} onDragStart={e => onDragStart(e, user)} onClick={() => props.toggleUser(user.id)} className={className}>
          <div className="user-row-hover">
            <div className="user-radio-column">
              <div className="drag-icon-container">
                <DragIndicatorIcon className="user-drag-icon" />
              </div>
              <Checkbox
                checked={user.selected}
                onMouseOver={() => onHover(user)} onMouseLeave={() => onBlur(user)} />
              {renderLibraryLink(user)}
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
              <ClassroomNames
                isPending={props.isPending}
                studyClassrooms={user.studyClassrooms}
                hasInvitation={user.hasInvitation}
                resendInvitation={() => props.resendInvitation(user.email, user.classroom)}
              />
            </div>
            <div className="selected-column">
              <div className="action-buttons">
                {props.isAdmin &&
                  <div className="edit-button svgOnHover">
                    <SpriteIcon
                      name="edit-outline"
                      className="active"
                      onClick={e => {
                        props.history.push(map.UserProfile + `/${user.id}`);
                        e.stopPropagation();
                      }}/>
                  </div>}
                {props.isClassroom &&
                  <div className="trash-button svgOnHover" onClick={e => {
                    props.unassign(user);
                    e.stopPropagation();
                  }}>
                    <SpriteIcon name="trash-outline" className="active" />
                  </div>
                }
              </div>
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
        togglePageStudents={props.togglePageStudents}
      />
      {users.map(renderStudent)}
    </div>
  );
}

export default StudentTable;
