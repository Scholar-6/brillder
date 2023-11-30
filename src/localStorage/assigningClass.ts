import {AssigningClassrooms, SidebarAssignmentsSort, SidebarClassroomSort} from './types';

export function GetAssigningClassrooms() {
  const dateFilter = localStorage.getItem(AssigningClassrooms);
  if (dateFilter) {
    try {
      return JSON.parse(dateFilter) as any;
    } catch {}
  }
  return null;
}

export function UnsetAssigningClassrooms() {
  localStorage.removeItem(AssigningClassrooms);
}

export function SetAssigningClassrooms(bricks: any[]) {
  localStorage.setItem(AssigningClassrooms, JSON.stringify(bricks));
}




export function GetSetSortSidebarAssignment() {
  const sort = localStorage.getItem(SidebarAssignmentsSort);
  if (sort) {
    return parseInt(sort);
  }
  return null;
}

export function SetSortSidebarAssignment(sort: number) {
  localStorage.setItem(SidebarAssignmentsSort, sort.toString());
}






export function GetSortSidebarClassroom() {
  const sort = localStorage.getItem(SidebarClassroomSort);
  if (sort) {
    return parseInt(sort);
  }
  return null;
}

export function SetSortSidebarClassroom(sort: number) {
  localStorage.setItem(SidebarClassroomSort, sort.toString());
}