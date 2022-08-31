import {LoginRedirectUrl, LoginHeartOfMercia, PlayFinishRedirectURL} from './types';

export function SetLoginRedirectUrl(url: string) {
  localStorage.setItem(LoginRedirectUrl, url);
}

export function GetLoginRedirectUrl() {
  return localStorage.getItem(LoginRedirectUrl);
}

export function UnsetLoginRedirectUrl() {
  localStorage.removeItem(LoginRedirectUrl);
}

export function SetHeartOfMerciaUser() {
  localStorage.setItem(LoginHeartOfMercia, 'true');
}

export function GetHeartOfMerciaUser() {
  return localStorage.getItem(LoginHeartOfMercia);
}

export function UnsetHeartOfMerciaUser() {
  localStorage.removeItem(LoginHeartOfMercia);
}


export function SetFinishRedirectUrl(url: string) {
  localStorage.setItem(PlayFinishRedirectURL, url);
}

export function GetFinishRedirectUrl() {
  return localStorage.getItem(PlayFinishRedirectURL);
}

export function UnsetFinishRedirectUrl() {
  localStorage.removeItem(PlayFinishRedirectURL);
}