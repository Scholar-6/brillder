import { Origin } from "./types";

export function SetOrigin(origin: string) {
  localStorage.setItem(Origin, origin);
}

export function GetOrigin() {
  return localStorage.getItem(Origin);
}

export function UnsetOrigin() {
  localStorage.removeItem(Origin);
}


export const checkIfSchool = () => {
  var origin = GetOrigin();
  if (origin === 'school') {
    return true;
  }
  return false;
}