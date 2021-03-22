import { PlayBase, realPlay } from "components/map";

const basePalyRoute = PlayBase + '/:brickId';

export const PlayCoverLastPrefix = '/cover';
export const PlaySectionsLastPrefix = '/sections';
export const PlayBriefLastPrefix = '/brief';
export const PlayPrePrepLastPrefix = '/pre-prep';

export const coverRoute = basePalyRoute + PlayCoverLastPrefix;
export const sectionsRoute = basePalyRoute + PlaySectionsLastPrefix;
export const briefRoute = basePalyRoute + PlayBriefLastPrefix;
export const prePrepRoute = basePalyRoute + PlayPrePrepLastPrefix;

export const playCover = (brickId: number) => realPlay(brickId) + PlayCoverLastPrefix;
export const playSections = (brickId: number) => realPlay(brickId) + PlaySectionsLastPrefix;
export const playBrief = (brickId: number) => realPlay(brickId) + PlayBriefLastPrefix;
export const playPrePrep = (brickId: number) => realPlay(brickId) + PlayPrePrepLastPrefix;

export default {
  coverRoute,
  sectionsRoute,
  briefRoute,
  prePrepRoute
}
