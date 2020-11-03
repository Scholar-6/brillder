import { Brick, BrickStatus } from 'model/brick';
import { User, UserType, UserRole } from 'model/user';

function formatTwoLastDigits(twoLastDigits: number) {
  var formatedTwoLastDigits = "";
  if (twoLastDigits < 10) {
    formatedTwoLastDigits = "0" + twoLastDigits;
  } else {
    formatedTwoLastDigits = "" + twoLastDigits;
  }
  return formatedTwoLastDigits;
}

export function getYear(date: Date) {
  var currentYear = date.getFullYear();
  var twoLastDigits = currentYear % 100;
  return formatTwoLastDigits(twoLastDigits);
}

export function getMonth(date: Date) {
  const month = date.getMonth() + 1;
  return formatTwoLastDigits(month);
}

export function getDate(date: Date) {
  const days = date.getDate();
  return formatTwoLastDigits(days);
}

export function getHours(date: string) {
  const hours = new Date(date).getHours();
  return formatTwoLastDigits(hours);
}

export function getTime(date: string) {
  return `${getHours(date)}:${getMinutes(date)}`;
}

export function getMinutes(date: string) {
  const minutes = new Date(date).getMinutes();
  return formatTwoLastDigits(minutes);
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
    const { author } = brick;
    if (author.firstName || author.firstName) {
      row += `${author.firstName} ${author.lastName} | `
    }
    row += `${date}.${month}.${year} | ${brick.brickLength} mins`; // ${getDate(new Date(brick.updated))} ${getMonth(new Date(brick.updated))} ${brick.hasNotifications}`;
  }
  return row;
}

export function getDateString(inputDateString: string) {
  const dateObj = new Date(inputDateString);
  const year = getYear(dateObj);
  const month = getMonth(dateObj);
  const date = getDate(dateObj);
  return `${date}.${month}.${year}`;
}

export function checkBuilder(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Builder);
}

export function checkTeacherOrAdmin(roles: UserRole[]) {
  return roles.some(r => r.roleId === UserType.Teacher || r.roleId === UserType.Admin);
}

export function checkEditor(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Publisher);
}

export function checkPublisher(user: User, brick: Brick) {
  const isAdmin = checkAdmin(user.roles);
  if (isAdmin) {
    return true;
  }
  const isEditor = checkEditor(user.roles);
  if (!isEditor) {
    return false;
  }
  let res = user.subjects.find(s => s.id === brick.subject?.id);
  if (res) {
    return true;
  }
  return false;
}

export function checkTeacher(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Teacher);
}

export function checkAdmin(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Admin);
}

export function canEditBrick(brick: Brick, user: User) {
  let isAdmin = checkAdmin(user.roles);
  let isPublisher = checkPublisher(user, brick);
  console.log(brick);
  switch(brick.status) {
    case BrickStatus.Draft:
      return brick.author?.id === user.id || isAdmin;
    case BrickStatus.Build:
      return isPublisher;
    case BrickStatus.Review:
      return isPublisher;
    case BrickStatus.Publish:
      return isAdmin || !brick.isCore;
    default:
      return brick.author?.id === user.id || isAdmin;
  }
}

export function canBuild(user: User) {
  return user.roles.some(role => {
    const { roleId } = role;
    return (roleId === UserType.Builder || roleId === UserType.Publisher || roleId === UserType.Admin);
  });
}

export function canEdit(user: User) {
  return user.roles.some(role => {
    const { roleId } = role;
    return roleId === UserType.Publisher || roleId === UserType.Admin;
  });
}

export function canDelete(userId: number, isAdmin: boolean, brick: Brick) {
  return isAdmin
    || (!(brick.status === BrickStatus.Publish && brick.isCore)
      && brick.author.id === userId);
}

export function checkTeacherEditorOrAdmin(user: User) {
  return user.roles.some(role => {
    const { roleId } = role;
    return roleId === UserType.Teacher || roleId === UserType.Publisher || roleId === UserType.Admin;
  });
}

export function getAssignmentIcon(brick: Brick) {
  let circleIcon = '';
  if (brick.assignments && brick.assignments.length > 0) {
    circleIcon = 'file-plus';
  }
  return circleIcon;
}
