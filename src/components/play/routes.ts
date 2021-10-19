import { stripHtml } from "components/build/questionService/ConvertService";
import { PlayBase, realPlay } from "components/map";
import { setAssignmentId } from "localStorage/playAssignmentId";
import { Brick } from "model/brick";
import { isPhone } from "services/phone";

const basePlayRoute = PlayBase + '/:brickId';

export const PlayCoverLastPrefix = '/cover';
export const PlaySectionsLastPrefix = '/sections';
export const PlayBriefLastPrefix = '/brief';
export const PlayPrePrepLastPrefix = '/pre-prep';
export const PlayNewPrepLastPrefix = '/prep';
export const PlayPreInvestigationLastPrefix = '/pre-investigation';
export const PlayCountInvestigationLastPrefix = '/countdown-investigation';
export const PlayLiveLastPrefix = '/live';
export const PlayProvisionalScoreLastPrefix = '/provisionalScore';
export const PlayPreSynthesisLastPrefix = '/pre-synthesis';
export const PlayTimeSynthesisLastPrefix = '/time-synthesis';
export const PlaySynthesisLastPrefix = '/synthesis';
export const PlayPreReviewLastPrefix = '/pre-review';
export const PlayTimeReviewLastPrefix = '/review-countdown';
export const PlayReviewLastPrefix = '/review';
export const PlayEndingLastPrefix = '/ending';
export const PlayFinalStepLastPrefix = '/finalStep';

export const coverRoute = basePlayRoute + PlayCoverLastPrefix;
export const sectionsRoute = basePlayRoute + PlaySectionsLastPrefix;
export const briefRoute = basePlayRoute + PlayBriefLastPrefix;
export const prePrepRoute = basePlayRoute + PlayPrePrepLastPrefix;
export const newPrepRoute = basePlayRoute + PlayNewPrepLastPrefix;
export const preInvestigationRoute = basePlayRoute + PlayPreInvestigationLastPrefix;
export const countInvestigationRoute = basePlayRoute + PlayCountInvestigationLastPrefix;
export const preSynthesisRoute = basePlayRoute + PlayPreSynthesisLastPrefix;
export const timeSynthesisRoute = basePlayRoute + PlayTimeSynthesisLastPrefix;
export const synthesisRoute = basePlayRoute + PlaySynthesisLastPrefix;
export const preReviewRoute = basePlayRoute + PlayPreReviewLastPrefix;
export const timeReviewRoute = basePlayRoute + PlayTimeReviewLastPrefix;
export const reviewRoute = basePlayRoute + PlayReviewLastPrefix;

const prepareURLString = (str?: string) => {
  if (str) {
    return '/' + encodeURI(str.replace(/\s+/g, '-').toLowerCase());
  }
  return '';
}

const preparePlayUrl = (brick: Brick, prefix: string) => {
  return realPlay(brick.id) + prefix + prepareURLString(brick.subject?.name) + prepareURLString(stripHtml(brick.title));
}

export const playCover = (brick: Brick) => preparePlayUrl(brick, PlayCoverLastPrefix);
export const playSections = (brick: Brick) => preparePlayUrl(brick, PlaySectionsLastPrefix);
export const playBrief = (brick: Brick) => preparePlayUrl(brick, PlayBriefLastPrefix);
export const playPrePrep = (brick: Brick) => preparePlayUrl(brick, PlayPrePrepLastPrefix);
export const playNewPrep = (brick: Brick) => preparePlayUrl(brick, PlayNewPrepLastPrefix);
export const playPreInvesigation = (brick: Brick) => preparePlayUrl(brick, PlayPreInvestigationLastPrefix);
export const playCountInvesigation = (brick: Brick) => preparePlayUrl(brick, PlayCountInvestigationLastPrefix);
export const playInvestigation = (brick: Brick) => preparePlayUrl(brick, PlayLiveLastPrefix);
export const playProvisionalScore = (brick: Brick) => preparePlayUrl(brick, PlayProvisionalScoreLastPrefix);
export const playPreSynthesis = (brick: Brick) => preparePlayUrl(brick, PlayPreSynthesisLastPrefix);
export const playTimeSynthesis = (brick: Brick) => preparePlayUrl(brick, PlayTimeSynthesisLastPrefix);
export const playSynthesis = (brick: Brick) => preparePlayUrl(brick, PlaySynthesisLastPrefix);
export const playPreReview = (brick: Brick) => preparePlayUrl(brick, PlayPreReviewLastPrefix);
export const playTimeReview = (brick: Brick) => preparePlayUrl(brick, PlayTimeReviewLastPrefix);
export const playReview = (brick: Brick) => preparePlayUrl(brick, PlayReviewLastPrefix);
export const playEnding = (brick: Brick) => preparePlayUrl(brick, PlayEndingLastPrefix);
export const playFinalStep = (brick: Brick) => preparePlayUrl(brick, PlayFinalStepLastPrefix);

// phone pages
export const PlayPhonePrepLastPrefix = '/intro';
export const phonePrep = (brick: Brick) => preparePlayUrl(brick, PlayPhonePrepLastPrefix);

/**
 * Set assignment and return link to play
 * @param brickId BrickId
 * @param assignmentId AssignmentId
 * @returns link to play
 */
export const playAssignment = (brick: Brick, assignmentId: number) => {
  setAssignmentId(assignmentId);
  if (isPhone()) {
    return phonePrep(brick);
  } else {
    return playCover(brick);
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
  countInvestigationRoute,
  preSynthesisRoute,
  timeSynthesisRoute,
  synthesisRoute,
  preReviewRoute,
  timeReviewRoute,
  reviewRoute,

  playCover,
  playSections,
  playBrief,
  playPrePrep,
  playNewPrep,
  playPreInvesigation,
  playCountInvesigation,
  playInvestigation,
  playProvisionalScore,
  playPreSynthesis,
  playTimeSynthesis,
  playSynthesis,
  playPreReview,
  playTimeReview,
  playReview,
  playEnding,
  playFinalStep,

  playAssignment,

  // phone
  PlayPhonePrepLastPrefix,
  phonePrep
}
