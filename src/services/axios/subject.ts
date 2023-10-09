import { Subject } from 'model/brick';
import {get} from './index';

/**
 * Get all subjects
 */
export const getSubjects = async () => {
  try {
    console.log('get subject 7777')
    let subjects = await get<Subject[]>("/subjects");
    if (subjects) {
      subjects = subjects.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    return subjects;
  } catch {
    return null;
  }
}