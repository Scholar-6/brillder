import { get, post } from './index';

export interface Coupon {
  ammountOff: number | null;
  code: string;
  percentOff: number | null;
  duration: string;
  durationInMounths: number | null;
}

export interface StripePrices {
  studentMonth: number;
  studentYearly: number;
  teacherMonth: number;
  teacherYearly: number;
}

/**
 * Get coupon by code name
 * return coupon or null if failed
 */
export const checkCoupon = async (coupon: string) => {
  try {
    return await post<Coupon>("/stripe/checkcoupon", { coupon });
  } catch {
    return null;
  }
}

/**
 * Get prices
 * return pirces or null if failed
 */
export const getPrices = async () => {
  try {
    return await get<StripePrices>("/stripe/getprices");
  } catch {
    return null;
  }
}

/**
 * Cancel Subscription
 */
export const cancelSubscription = async (userId: number) => {
  try {
    return await post<Boolean>("/stripe/cancelSubscription", { userId });
  } catch {
    return null;
  }
}

export const getCardDetails = async () => {
  try {
    return await get("/stripe/cardDetails");
  } catch {
    return null;
  }
}