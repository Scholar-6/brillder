import { Brick, BrickStatus } from 'model/brick';
import { User, UserType, UserRole, UserPreferenceType } from 'model/user';
import { isInstitutionPreference, isTeacherPreference } from './preferenceService';

export function formatTwoLastDigits(twoLastDigits: number) {
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

export function getSeconds(date: string) {
  const hours = new Date(date).getSeconds();
  return formatTwoLastDigits(hours);
}

export function getTime(date: string) {
  return `${getHours(date)}:${getMinutes(date)}`;
}

export function getTimeV2(date: string) {
  return `${getHours(date)}:${getMinutes(date)}:${getSeconds(date)}`;
}

export function getMinutes(date: string) {
  const minutes = new Date(date).getMinutes();
  return formatTwoLastDigits(minutes);
}

export function fileFormattedDate(date: string) {
  return getFormattedDate(date) + ' ' + getHours(date) + "-" + getMinutes(date);  
}

export function getFormattedDate(date: string) {
  const dateObj = new Date(date);
  const year = getYear(dateObj);
  const month = getMonth(dateObj);
  const dateNum = getDate(dateObj);
  return `${dateNum}.${month}.${year}`;
}

export function getFormattedDateSlash(date: string) {
  const dateObj = new Date(date);
  const year = getYear(dateObj);
  const month = getMonth(dateObj);
  const dateNum = getDate(dateObj);
  return `${dateNum}_${month}_${year}`;
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

export function getDateStringV2(inputDateString: string, separator: string) {
  const dateObj = new Date(inputDateString);
  const year = getYear(dateObj);
  const month = getMonth(dateObj);
  const date = getDate(dateObj);
  return `${date}${separator}${month}${separator}${year}`;
}

export function getAttemptDateString(inputDateString: string) {
  const dateObj = new Date(inputDateString);
  const year = dateObj.getFullYear();
  const month = getMonth(dateObj);
  const date = getDate(dateObj);
  return `${date}/${month}/${year}`;
}

export function checkTeacherOrAdmin(user: User) {
  if (isTeacherPreference(user)) {
    return true;
  }
  if (isInstitutionPreference(user)) {
    return true;
  }
  return user.roles.some(r => r.roleId === UserType.Admin);
}

export function checkEditor(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Publisher);
}

export function checkOnlyPublisher(user: User, brick: Brick) {
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

export function checkTeacher(user: User) {
  return user.userPreference?.preferenceId === UserPreferenceType.Teacher;
}

export function checkBuilder(user: User) {
  return user.userPreference?.preferenceId === UserPreferenceType.Builder;
}

export function checkAdmin(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Admin);
}

export function checkRealInstitution(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Institution);
}

export function checkAdminOrInstitution(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Admin || role.roleId === UserType.Institution);
}

export function isAorP(roles: UserRole[]) {
  return roles.some(role => role.roleId === UserType.Publisher || role.roleId === UserType.Admin);
}

export function isAorPorE(brick: Brick, user: User) {
  let adminOrPublisher = user.roles.some(role => role.roleId === UserType.Publisher || role.roleId === UserType.Admin);
  if (adminOrPublisher) {
    return true;
  }
  const isEditor = brick.editors && brick.editors.findIndex(e => e.id === user.id) >= 0;
  if (isEditor) {
    return true;
  }
  return false;
}

export function canEditBrick(brick: Brick, user: User) {
  let isAdmin = checkAdmin(user.roles);
  let isPublisher = checkPublisher(user, brick);
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

export function canEdit(user: User) {
  return user.roles.some(role => {
    const { roleId } = role;
    return roleId === UserType.Publisher || roleId === UserType.Admin;
  });
}

export function canDelete(userId: number, isAdmin: boolean, brick: Brick) {
  return isAdmin
    || (!(brick.status !== BrickStatus.Draft && brick.isCore)
      && brick.author.id === userId);
}

export function checkTeacherEditorOrAdmin(user: User) {
  if (user.userPreference?.preferenceId === UserPreferenceType.Teacher) {
    return true;
  }
  return user.roles.some(role => {
    const { roleId } = role;
    return roleId === UserType.Publisher || roleId === UserType.Admin;
  });
}

export function getAssignmentIcon(brick: Brick) {
  let circleIcon = '';
  if (brick.assignments && brick.assignments.length > 0) {
    circleIcon = 'file-plus';
  }
  return circleIcon;
}

export function canTeach(user: User) {
  let canTeach = checkTeacherOrAdmin(user);  
  if (!canTeach && user.userPreference) {
    if (user.userPreference.preferenceId === UserPreferenceType.Teacher) {
      canTeach = true;
    }
  }
  return canTeach;
}

