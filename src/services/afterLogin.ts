import { ClearQuickAssignment, GetQuickAssignment } from "localStorage/play";
import { quickAcceptClassroom } from "./axios/classroom";

// this function is called after successfull login or register
export const afterLoginorRegister = () => {
  console.log('login or register success. also terms page');

  // quick assignment after login or register if user was invited by code
  const assignment = GetQuickAssignment();
  if (assignment && assignment.accepted === true) {
    if (assignment.classroom) {
      quickAcceptClassroom(assignment.classroom.id);
    }
    ClearQuickAssignment();
  }
}