import { Brick } from 'model/brick';
import {
  AttemptCash, YoutubeClicked, PreviewAttemptCash, VolumeToggle,
  UserBrills, AuthBrickCash, UnauthBrickCash, QuickAssignment, QuickAssignmentPlay, LastAttemptId }
from './types';
import { QuickAssigment } from 'components/baseComponents/classInvitationDialog/QuickClassInvitationDialog';

export function SetYoutubeClick() {
  localStorage.setItem(YoutubeClicked, "true");
}

export function GetYoutubeClick() {
  return localStorage.getItem(YoutubeClicked);
}

export function UnsetYoutubeClick() {
  localStorage.removeItem(YoutubeClicked);
}

/**
 * Toggle volume
 * @param volume boolean, true means disabled
 */
export function SetVolume(volume: boolean) {
  localStorage.setItem(VolumeToggle, volume.toString());
}

/**
 * Toggle volume
 * @return boolean, true means disabled
 */
export function GetVolume() {
  const volume = localStorage.getItem(VolumeToggle);
  if (volume === "true") {
    return true;
  }
  return false;
}

export function CashAttempt(attemptCash: any) {
  localStorage.setItem(AttemptCash, attemptCash);
}

export function GetCashedPlayAttempt() {
  return localStorage.getItem(AttemptCash);
}

export function PreviewCashAttempt(attemptCash: any) {
  localStorage.setItem(PreviewAttemptCash, attemptCash);
}

export function GetPreviewCashedPlayAttempt() {
  return localStorage.getItem(PreviewAttemptCash);
}






// data used for redirection when user is trying to log in.
export function SetAuthBrickCash(brick: Brick, competitionId: number) {
  const obj = {
    brick: {
      id: brick.id,
      title: brick.title,
      subject: {
        name: brick.subject?.name
      }
    },
    competitionId
  } as any;
  const objString = JSON.stringify(obj);
  localStorage.setItem(AuthBrickCash, objString);
}

export function GetAuthBrickCash() {
  const objString = localStorage.getItem(AuthBrickCash);
  if (objString) {
    try {
      return JSON.parse(objString);
    } catch (e) { }
  }
  return -1;
}

export function ClearAuthBrickCash() {
  localStorage.removeItem(AuthBrickCash);
}






// needed for redirection of incognito user as he was trying to access personal brick.
// he will be redirected to login and then after success will be redirected to personal brick again.
export function SetUnauthBrickCash(brick: Brick) {
  const obj = {
    brick: {
      id: brick.id,
      title: brick.title,
      subject: {
        name: brick.subject?.name
      }
    },
  } as any;
  const objString = JSON.stringify(obj);
  localStorage.setItem(UnauthBrickCash, objString);
}

export function GetUnauthBrickCash() {
  const objString = localStorage.getItem(UnauthBrickCash);
  if (objString) {
    try {
      return JSON.parse(objString);
    } catch (e) { }
  }
  return -1;
}

export function ClearUnauthBrickCash() {
  localStorage.removeItem(UnauthBrickCash);
}






// user brills
export function SetUserBrills(brills: number) {
  localStorage.setItem(UserBrills, brills.toString());
}

export function GetUserBrills() {
  const brills = localStorage.getItem(UserBrills);
  if (brills) {
    return parseInt(brills);
  }
  return 0;
}





// quick assignment
// he will be redirected to login and then after success will be redirected to personal brick again.
export function SetQuickAssignment(code: string) {
  localStorage.setItem(QuickAssignment, code);
}

export function GetQuickAssignment () {
  const data = localStorage.getItem(QuickAssignment)
  if (data) {
    return JSON.parse(data) as QuickAssigment;
  }
  return data as null;
}

export function ClearQuickAssignment() {
  localStorage.removeItem(QuickAssignment);
}





// in the end of play show popup if quick assigned
export function SetQuickPlayAssignment(code: string) {
  localStorage.setItem(QuickAssignmentPlay, code);
}

export function GetQuickPlayAssignment () {
  const data = localStorage.getItem(QuickAssignmentPlay)
  if (data) {
    return JSON.parse(data) as QuickAssigment;
  }
  return data as null;
}

export function ClearQuickPlayAssignment() {
  localStorage.removeItem(QuickAssignmentPlay);
}





// last attempt id of not logged in user
// he will be redirected to login and then after success will be redirected to personal brick again.
export function SetLastAttemptId(attemptId: string | undefined) {
  if (attemptId) {
    localStorage.setItem(LastAttemptId, attemptId);
  } else {
    localStorage.setItem(LastAttemptId, '');
  }
}

export function GetLastAttemptId() {
  return localStorage.getItem(LastAttemptId)
}

export function ClearLastAttemptId() {
  localStorage.removeItem(LastAttemptId);
}