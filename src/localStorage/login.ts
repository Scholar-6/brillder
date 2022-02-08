import {LoginRedirectUrl} from './types';

export function SetLoginRedirectUrl(url: string) {
  localStorage.setItem(LoginRedirectUrl, url);
}

export function GetLoginRedirectUrl() {
  return localStorage.getItem(LoginRedirectUrl);
}

export function UnsetLoginRedirectUrl() {
  localStorage.removeItem(LoginRedirectUrl);
}