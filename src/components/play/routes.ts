import { PlayBase, realPlay } from "components/map";

export const PlayCoverLastPrefix = '/cover';
export const PlayAfterCoverLastPrefix = '/after-cover';

export const coverRoute = PlayBase + '/:brickId' + PlayCoverLastPrefix;
export const afterCoverRoute = PlayBase + '/:brickId' + PlayAfterCoverLastPrefix;

export const playCover = (brickId: number) => {
  return realPlay(brickId) + PlayCoverLastPrefix;
}

export default {
  coverRoute,
  afterCoverRoute
}
