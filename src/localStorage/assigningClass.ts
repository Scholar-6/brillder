import {AssigningClassrooms} from './types';

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
