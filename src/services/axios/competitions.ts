import { Competition } from 'model/competition';
import { checkCompetitionActive } from 'services/competition';
import {get} from './index';


export const getCompetitionLeaderboard = async (competitionId: number) => {
  try {
    return await get<any>(`/competitionLeaderboard/` + competitionId);
  } catch {
    return null;
  }
}

export const getCompetitionsByBrickId = async (brickId: number) => {
  try {
    return await get<Competition[]>(`/competitionByBrick/` + brickId);
  } catch {
    return null;
  }
}

export const getCompetitionByUser = async (userId: number, brickId: number) => {
  try {
    const data = await get<Competition>(`/competition/${userId}/${brickId}`);

    if (data) {
      const c = data;
      data.isActive = checkCompetitionActive(c);
      return data;
    }
    return null;
  } catch {
    return null;
  }
}
