import { Subject } from 'model/brick';
import {get} from './index';

/**
 * Get all subjects
 */
export const getSubjects = async () => {
  try {
    return await get<Subject[]>("/subjects");
  } catch {
    return null;
  }
}