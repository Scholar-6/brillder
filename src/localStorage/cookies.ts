import { CookiesPolicy } from './types'

export function clearCookiePolicy() {
  localStorage.removeItem(CookiesPolicy);
}

export function acceptCookies() {
  localStorage.setItem(CookiesPolicy, "true");
}

export function getCookies() {
  try {
    const res = localStorage.getItem(CookiesPolicy) as string;
    if (res === "true") {
      return true;
    }
    return false;
  } catch { }
  return null;
}
