import { Brick } from 'model/brick';
import {AttemptCash, YoutubeClicked, PreviewAttemptCash, VolumeToggle, UserBrills, AuthBrickCash} from './types';

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