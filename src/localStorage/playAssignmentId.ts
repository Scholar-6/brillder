import { PlayAssignmentId } from './types'

export function clearAssignmentId() {
  localStorage.removeItem(PlayAssignmentId);
}

export function setAssignmentId(assignmentId: number) {
  if (assignmentId) {
    localStorage.setItem(PlayAssignmentId, assignmentId.toString());
  }
}

export function getAssignmentId() {
  try {
    return parseInt(localStorage.getItem(PlayAssignmentId) as string);
  } catch { }
  return null;
}
