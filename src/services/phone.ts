import { isMobile, isTablet, isIPad13 } from "react-device-detect";

export const isPhone = () => {
  if (isMobile && !(isTablet || isIPad13)) {
    return true;
  }
  return false;
}