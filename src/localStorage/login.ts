import {LoginRedirectUrl, LoginHeartOfMercia, PlayFinishRedirectURL, LoginUrl, ActivateUrl} from './types';

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
  console.log('set redirect url', url);
  localStorage.setItem(PlayFinishRedirectURL, url);
}

export function GetFinishRedirectUrl() {
  console.log('get redirect url');
  return localStorage.getItem(PlayFinishRedirectURL);
}

export function UnsetFinishRedirectUrl() {
  console.log('remove redirect url');
  localStorage.removeItem(PlayFinishRedirectURL);
}


export function SetLoginUrl(url: string) {
  localStorage.setItem(LoginUrl, url);
}

export function GetLoginUrl() {
  return localStorage.getItem(LoginUrl);
}

export function UnsetLoginUrl() {
  localStorage.removeItem(LoginUrl);
}

export function SetActivateUrl(url: string) {
  localStorage.setItem(ActivateUrl, url);
}

export function GetActivateUrl() {
  return localStorage.getItem(ActivateUrl);
}

export function UnsetActivateUrl() {
  localStorage.removeItem(ActivateUrl);
}