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
    return await get<any>(`/competitionByBrick/` + brickId);
  } catch {
    return null;
  }
}
