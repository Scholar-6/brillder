import { Brick, BrickStatus } from 'model/brick';

import {get, post} from './index';

/**
 * Get all bricks
 * return list of bricks if success or null if failed
 */
export const getBricks = async () => {
  try {
    return await get<Brick[]>("/bricks");
  } catch {
    return null;
  }
}

/**
 * Get current user bricks
 * return list of bricks if success or null if failed
 */
export const getCurrentUserBricks = async () => {
  try {
    return await get<Brick[]>("/bricks/currentUser"); 
  } catch (e) {
    return null;
  }
}

export const getAssignedBricks = async () => {
  try {
    return await get<any[]>("/bricks/assigned"); 
  } catch (e) {
    return null;
  }
}

export const searchBricks = async (searchString: string = '') => {
  try {
    return await post<Brick[]>("/bricks/search", { searchString });
  } catch (e) {
    return null;
  }
}

export const publishBrick = async (brickId: number) => {
  try {
    const brick = await post<Brick>(`/brick/publish/${brickId}`, {});
    if (brick && brick.status === BrickStatus.Publish) {
      return true;
    }
    return null;
  } catch {
    return null;
  }
}
 