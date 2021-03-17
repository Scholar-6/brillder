import { PlayBase, realPlay } from "components/map";

export const PlayCoverLastPrefix = '/cover';

export const coverRoute = PlayBase + '/:brickId' + PlayCoverLastPrefix;

export const playCover = (brickId: number) => {
  return realPlay(brickId) + PlayCoverLastPrefix;
}
