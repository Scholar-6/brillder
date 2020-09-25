import { ApiAssignemntStats } from 'model/stats';
import {get} from './index';

/**
 * Get assignment stats by Id
 * return brick or null if failed
 */
export const getAssignmentStats = async (id: number) => {
  try {
    return await get<ApiAssignemntStats>("/stats/assignment/" + id);
  } catch {
    return null;
  }
}
