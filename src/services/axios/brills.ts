
import {get, post} from './index';

export const convertBrillsToCredits = async (competitionId: number | null) => {
  try {
    await post<any>(`/convertBrillsToCredits/` + (competitionId ? competitionId : 0), {});
    return true;
  } catch {
    return null;
  }
}

export const convertBrillsToCreditsByAmount = async (brills: number) => {
  try {
    await post<any>(`/convertBrillsToCreditsByAmount/` + brills, {});
    return true;
  } catch {
    return null;
  }
}

export const getUserBrillsForBrick = async (brickId: number) => {
  try {
    return (await get<any>(`/play/totalBrillsForBrick/${brickId}`)).totalBrills;
  } catch {
    return null;
  }
}