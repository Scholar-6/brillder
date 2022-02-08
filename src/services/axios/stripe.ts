import { ApiAssignemntStats } from 'model/stats';
import {post} from './index';

/**
 * Get assignment stats by Id
 * return brick or null if failed
 */
export const checkCoupon = async (coupon: string) => {
  try {
    return await post<any>("/stripe/checkcoupon", { coupon });
  } catch {
    return null;
  }
}
