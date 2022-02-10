import {post} from './index';

export interface Coupon {
  ammountOff: number | null;
  code: string;
  percentOff: number | null;
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
