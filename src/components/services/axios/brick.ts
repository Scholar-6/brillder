import { AssignmentBrick } from 'model/assignment';
import { Brick, BrickStatus } from 'model/brick';

import {get, put, post, axiosDelete} from './index';

export const getPublicBrickById = async (id: number) => {
  try {
    return await get<Brick>("/brick/public/" + id);
  } catch {
    return null;
  }
}

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
 * Get bricks by status
 * return list of bricks if success or null if failed
 */
export const getPublishedBricks = async () => {
  try {
    return await get<Brick[]>(`/bricks/byStatus/${BrickStatus.Publish}`);
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
    return await get<AssignmentBrick[]>("/bricks/assigned"); 
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

export const inviteUser = async (brickId: number, userId: number) => {
  try {
    await post<Brick>(`/brick/inviteToBrick/${brickId}`, {userIds: [userId]});
    return true;
  } catch {
    return false;
  }
}

export const setCoreLibrary = async (brickId: number, isCore?: boolean) => {
  try {
    let core = false;
    if (isCore) {
      core = true;
    }
    await put<Brick>(`/brick/setCoreLibrary/${brickId}/${core}`, {});
    return true;
  } catch {
    return false;
  }
}

export const sendToPublisher = async (brickId: number) => {
  try {
    await post<any>(`/brick/sendToPublisher/${brickId}`, {});
    return true;
  } catch {
    return false;
  }
}

export const deleteComment = async (brickId: number, commentId: number) => {
  try {
    return await axiosDelete(`/brick/${brickId}/comment/${commentId}`);
  } catch {
    return false;
  }
}

export const returnToAuthor = async (brickId: number) => {
  try {
    await post<Brick>(`/brick/returnToAuthor`, { brickId });
    return true;
  } catch {
    return false;
  }
}

export const returnToEditor = async (brickId: number) => {
  try {
    await post<any>(`/brick/returnToEditor`, { brickId });
    return true;
  } catch {
    return false;
  }
}


export default {
  sendToPublisher
}
