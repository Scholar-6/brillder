import {LoginRedirectUrl, LoginHeartOfMercia} from './types';

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