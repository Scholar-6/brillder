import {LoginRedirectUrl, LoginHeartOfMercia, PlayFinishRedirectURL, LoginUrl} from './types';

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
  console.log('set login url');
  localStorage.setItem(LoginUrl, url);
}

export function GetLoginUrl() {
  console.log('get login url');
  return localStorage.getItem(LoginUrl);
}

export function UnsetLoginUrl() {
  console.log('remove login url');
  localStorage.removeItem(LoginUrl);
}