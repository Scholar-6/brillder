import { PlayAttempt } from 'model/attempt';

import {get} from './index';

export const getAttempts = async (brickId: number, userId: number) => {
  try {
    let attempts = await get<PlayAttempt[]>(`/play/attempt/${brickId}/${userId}`);
    if (attempts) {
      let validAttempts = attempts.filter(a => a.liveAnswers);
      return validAttempts;
    }
    return null;
  } catch {
    return null;
  }
}
