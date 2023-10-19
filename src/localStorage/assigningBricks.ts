import {ClassWithNewAssignments} from './types';

export function GetClassAssignedBricks() {
  const dateFilter = localStorage.getItem(ClassWithNewAssignments);
  if (dateFilter) {
    try {
      return JSON.parse(dateFilter) as any;
    } catch {}
  }
  return null;
}

export function UnsetClassroomAssignedBricks() {
  localStorage.removeItem(ClassWithNewAssignments);
}

export function SetClassroomAssignedBricks(classroom: any) {
  localStorage.setItem(ClassWithNewAssignments, JSON.stringify({ ...classroom }));
}
