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
    return await get<any[]>(`/competitionByBrick/` + brickId);
  } catch {
    return null;
  }
}

export const getCompetitionByUser = async (userId: number, brickId: number) => {
  try {
    const data = await get<any>(`/competition/${userId}/${brickId}`);

    if (data) {
      const c = data;
      const endDate = new Date(c.endDate);
      const startDate = new Date(c.startDate);
      let isActive = false;
      if (endDate.getTime() > new Date().getTime()) {
        if (startDate.getTime() < new Date().getTime()) {
          isActive = true;
        }
      }
      data.isActive = isActive;
      return data;
    }
    return null;
  } catch {
    return null;
  }
}
