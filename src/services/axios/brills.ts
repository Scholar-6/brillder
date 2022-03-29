
import {post} from './index';

export const convertBrillsToCredits = async (competitionId: number | null) => {
  try {
    await post<any>(`/convertBrillsToCredits/` + (competitionId ? competitionId : 0), {});
    return true;
  } catch {
    return null;
  }
}