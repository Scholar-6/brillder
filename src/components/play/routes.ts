import { PlayBase, realPlay } from "components/map";

const basePlayRoute = PlayBase + '/:brickId';

export const PlayCoverLastPrefix = '/cover';
export const PlaySectionsLastPrefix = '/sections';
export const PlayBriefLastPrefix = '/brief';
export const PlayPrePrepLastPrefix = '/pre-prep';
export const PlayNewPrepLastPrefix = '/new-prep';
export const PlayPreInvestigationLastPrefix = '/pre-investigation';
export const PlayPreSynthesisLastPrefix = '/pre-synthesis';
export const PlaySynthesisLastPrefix = '/synthesis';
export const PlayPreReviewLastPrefix = '/pre-review';
export const PlayReviewLastPrefix = '/review';

export const coverRoute = basePlayRoute + PlayCoverLastPrefix;
export const sectionsRoute = basePlayRoute + PlaySectionsLastPrefix;
export const briefRoute = basePlayRoute + PlayBriefLastPrefix;
export const prePrepRoute = basePlayRoute + PlayPrePrepLastPrefix;
export const newPrepRoute = basePlayRoute + PlayNewPrepLastPrefix;
export const preInvestigationRoute = basePlayRoute + PlayPreInvestigationLastPrefix;
export const preSynthesisRoute = basePlayRoute + PlayPreSynthesisLastPrefix;
export const synthesisRoute = basePlayRoute + PlaySynthesisLastPrefix;
export const preReviewRoute = basePlayRoute + PlayPreReviewLastPrefix;
export const reviewRoute = basePlayRoute + PlayReviewLastPrefix;

export const playCover = (brickId: number) => realPlay(brickId) + PlayCoverLastPrefix;
export const playSections = (brickId: number) => realPlay(brickId) + PlaySectionsLastPrefix;
export const playBrief = (brickId: number) => realPlay(brickId) + PlayBriefLastPrefix;
export const playPrePrep = (brickId: number) => realPlay(brickId) + PlayPrePrepLastPrefix;
export const playNewPrep = (brickId: number) => realPlay(brickId) + PlayNewPrepLastPrefix;
export const playPreInvesigation = (brickId: number) => realPlay(brickId) + PlayPreInvestigationLastPrefix;
export const playPreSynthesis = (brickId: number) => realPlay(brickId) + PlayPreSynthesisLastPrefix;
export const playSynthesis = (brickId: number) => realPlay(brickId) + PlaySynthesisLastPrefix;
export const playPreReview = (brickId: number) => realPlay(brickId) + PlayPreReviewLastPrefix;
export const playReview = (brickId: number) => realPlay(brickId) + PlayReviewLastPrefix;

export default {
  PlayCoverLastPrefix,
  PlaySectionsLastPrefix,
  PlayBriefLastPrefix,
  PlayPrePrepLastPrefix,
  PlayNewPrepLastPrefix,
  PlayPreInvestigationLastPrefix,
  PlayPreSynthesisLastPrefix,
  PlaySynthesisLastPrefix,
  PlayPreReviewLastPrefix,
  PlayReviewLastPrefix,

  coverRoute,
  sectionsRoute,
  briefRoute,
  prePrepRoute,
  newPrepRoute,
  preInvestigationRoute,
  preSynthesisRoute,
  synthesisRoute,
  preReviewRoute,
  reviewRoute,

  playCover,
  playSections,
  playBrief,
  playPrePrep,
  playNewPrep,
  playPreInvesigation,
  playPreSynthesis,
  playSynthesis,
  playPreReview,
  playReview
}
