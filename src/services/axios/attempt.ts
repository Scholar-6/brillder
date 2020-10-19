import { PlayAttempt } from 'model/attempt';

import {get} from './index';

export const getAttempts = async (brickId: number, userId: number) => {
  try {
    return await get<PlayAttempt[]>(`/play/attempt/${brickId}/${userId}`);
  } catch {
    return null;
  }
}
