import { Brick } from 'model/brick';
import { User, UserType, UserRole } from 'model/user';

function formatTwoLastDigits(twoLastDigits: number) {
  var formatedTwoLastDigits = "";
  if (twoLastDigits < 10 ) {
    formatedTwoLastDigits = "0" + twoLastDigits;
  } else {
    formatedTwoLastDigits = "" + twoLastDigits;
  }
  return formatedTwoLastDigits;
}

export function getYear(date: Date) {
  var currentYear =  date.getFullYear();   
  var twoLastDigits = currentYear % 100;
  return formatTwoLastDigits(twoLastDigits);
}

export function getMonth(date: Date) {
  const month = date.getMonth() + 1;
  var twoLastDigits = month % 10;
  return formatTwoLastDigits(twoLastDigits);
}

export function getDate(date: Date) {
  const days = date.getDate();
  return formatTwoLastDigits(days);
}

export function getFormattedDate(date: string) {
  const dateObj = new Date(date);
  const year = getYear(dateObj);
  const month = getMonth(dateObj);
  const dateNum = getDate(dateObj);
  return `${dateNum}.${month}.${year}`;
}

export function getAuthorRow(brick: Brick) {
  let row = "";
  const created = new Date(brick.created);
  const year = getYear(created);
  const month = getMonth(created);
  const date = getDate(created);
  if (brick.author) {
    const {author} = brick;
    if (author.firstName || author.firstName) {
      row += `${author.firstName} ${author.lastName} | `
    }
    row += `${date}.${month}.${year} | ${brick.brickLength} mins`;
  }
  return row;
}

export function checkBuilder(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Builder);
}

export function checkTeacherOrAdmin(roles: UserRole[]) {
  return roles.some(r => r.roleId === UserType.Teacher || r.roleId === UserType.Admin);
}

export function checkEditor(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Editor);
}

export function checkTeacher(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Teacher);
}

export function checkAdmin(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Admin);
}

export function canEditBrick(brick: any, user: User) {
  let isAdmin = checkAdmin(user.roles);
  if (isAdmin) {
    return true;
  }
  let isBuilder = checkBuilder(user.roles);
  if (isBuilder) {
    if (brick.author?.id === user.id) {
      return true;
    }
  }
  return false;
}

export function canBuild(user: User) {
  return user.roles.some(role => {
    const { roleId } = role;
    return (roleId === UserType.Builder || roleId === UserType.Editor || roleId === UserType.Admin);
  });
}

export function canEdit(user: User) {
  return user.roles.some(role => {
    const { roleId } = role;
    return roleId === UserType.Editor || roleId === UserType.Admin;
  });
}

export function checkTeacherEditorOrAdmin(user: User) {
  return user.roles.some(role => {
    const { roleId } = role;
    return roleId === UserType.Teacher || roleId === UserType.Editor || roleId === UserType.Admin;
  });
}

export function getAssignmentIcon(brick: Brick) {
  let circleIcon = '';
  if (brick.assignments && brick.assignments.length > 0) {
    circleIcon = 'file-plus';
  }
  return circleIcon;
}
