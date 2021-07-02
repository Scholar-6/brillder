import { PlayBase, realPlay } from "components/map";
import { setAssignmentId } from "localStorage/playAssignmentId";
import { isPhone } from "services/phone";

const basePlayRoute = PlayBase + '/:brickId';

export const PlayCoverLastPrefix = '/cover';
export const PlaySectionsLastPrefix = '/sections';
export const PlayBriefLastPrefix = '/brief';
export const PlayPrePrepLastPrefix = '/pre-prep';
export const PlayNewPrepLastPrefix = '/prep';
export const PlayPreInvestigationLastPrefix = '/pre-investigation';
export const PlayLiveLastPrefix = '/live';
export const PlayProvisionalScoreLastPrefix = '/provisionalScore';
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
export const playInvestigation = (brickId: number) => realPlay(brickId) + PlayLiveLastPrefix;
export const playProvisionalScore = (brickId: number) => realPlay(brickId) + PlayProvisionalScoreLastPrefix;
export const playPreSynthesis = (brickId: number) => realPlay(brickId) + PlayPreSynthesisLastPrefix;
export const playSynthesis = (brickId: number) => realPlay(brickId) + PlaySynthesisLastPrefix;
export const playPreReview = (brickId: number) => realPlay(brickId) + PlayPreReviewLastPrefix;
export const playReview = (brickId: number) => realPlay(brickId) + PlayReviewLastPrefix;

// phone pages
export const PlayPhonePrepLastPrefix = '/intro';
export const phonePrep = (brickId: number) => realPlay(brickId) + PlayPhonePrepLastPrefix;

/**
 * Set assignment and return link to play
 * @param brickId BrickId
 * @param assignmentId AssignmentId
 * @returns link to play
 */
export const playAssignment = (brickId: number, assignmentId: number) => {
  setAssignmentId(assignmentId);
  if (isPhone()) {
    return phonePrep(brickId);
  } else {
    return playCover(brickId);
  }
}

export default {
  PlayCoverLastPrefix,
  PlaySectionsLastPrefix,
  PlayBriefLastPrefix,
  PlayPrePrepLastPrefix,
  PlayNewPrepLastPrefix,
  PlayPreInvestigationLastPrefix,
  PlayLiveLastPrefix,
  PlayProvisionalScoreLastPrefix,
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
  playInvestigation,
  playProvisionalScore,
  playPreSynthesis,
  playSynthesis,
  playPreReview,
  playReview,

  playAssignment,

  // phone
  PlayPhonePrepLastPrefix,
  phonePrep
}
