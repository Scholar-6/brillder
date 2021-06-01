import {YoutubeClicked} from './types';

export function SetYoutubeClick() {
  localStorage.setItem(YoutubeClicked, "true");
}

export function GetYoutubeClick() {
  return localStorage.getItem(YoutubeClicked);
}

export function UnsetYoutubeClick() {
  localStorage.removeItem(YoutubeClicked);
}