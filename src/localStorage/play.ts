import {AttemptCash, YoutubeClicked, AuthBrickCoverId, PreviewAttemptCash, VolumeToggle, UserBrills} from './types';

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

export function SetAuthBrickCoverId(brickId: number) {
  localStorage.setItem(AuthBrickCoverId, brickId.toString());
}

export function GetAuthBrickCoverId() {
  const stringId = localStorage.getItem(AuthBrickCoverId);
  if (stringId) {
    return parseInt(stringId);
  }
  return -1;
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