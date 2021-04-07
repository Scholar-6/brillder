import routes from '../play/routes';

const basePreview = '/play-preview/brick';
const basePlayRoute = basePreview + '/:brickId';

const preview = (brickId: number) => `${basePreview}/${brickId}`;

export const coverRoute = basePlayRoute + routes.PlayCoverLastPrefix;
export const sectionsRoute = basePlayRoute + routes.PlaySectionsLastPrefix;
export const briefRoute = basePlayRoute + routes.PlayBriefLastPrefix;
export const prePrepRoute = basePlayRoute + routes.PlayPrePrepLastPrefix;
export const newPrepRoute = basePlayRoute + routes.PlayNewPrepLastPrefix;
export const preInvestigationRoute = basePlayRoute + routes.PlayPreInvestigationLastPrefix;
export const liveRoute = basePlayRoute + routes.PlayLiveLastPrefix;
export const preSynthesisRoute = basePlayRoute + routes.PlayPreSynthesisLastPrefix;
export const synthesisRoute = basePlayRoute + routes.PlaySynthesisLastPrefix;
export const preReviewRoute = basePlayRoute + routes.PlayPreReviewLastPrefix;
export const reviewRoute = basePlayRoute + routes.PlayReviewLastPrefix;


export const previewCover = (brickId: number) => preview(brickId) + routes.PlayCoverLastPrefix;
export const previewSections = (brickId: number) => preview(brickId) + routes.PlaySectionsLastPrefix;
export const previewBrief = (brickId: number) => preview(brickId) + routes.PlayBriefLastPrefix;
export const previewPrePrep = (brickId: number) => preview(brickId) + routes.PlayPrePrepLastPrefix;
export const previewNewPrep = (brickId: number) => preview(brickId) + routes.PlayNewPrepLastPrefix;
export const previewPreInvesigation = (brickId: number) => preview(brickId) + routes.PlayPreInvestigationLastPrefix;
export const previewLive = (brickId: number) => preview(brickId) + routes.PlayLiveLastPrefix;
export const previewPreSynthesis = (brickId: number) => preview(brickId) + routes.PlayPreSynthesisLastPrefix;
export const previewSynthesis = (brickId: number) => preview(brickId) + routes.PlaySynthesisLastPrefix;
export const previewPreReview = (brickId: number) => preview(brickId) + routes.PlayPreReviewLastPrefix;
export const previewReview = (brickId: number) => preview(brickId) + routes.PlayReviewLastPrefix;


export default {
  coverRoute,
  sectionsRoute,
  briefRoute,
  prePrepRoute,
  newPrepRoute,
  preInvestigationRoute,
  liveRoute,
  preSynthesisRoute,
  synthesisRoute,
  preReviewRoute,
  reviewRoute,

  previewCover,
  previewSections,
  previewBrief,
  previewPrePrep,
  previewNewPrep,
  previewPreInvesigation,
  previewLive,
  previewPreSynthesis,
  previewSynthesis,
  previewPreReview,
  previewReview
}
