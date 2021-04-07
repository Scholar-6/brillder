import routes from '../play/routes';

const basePreview = '/play-preview/brick';
const basePlayRoute = basePreview + '/:brickId';

const preview = (brickId: number) => `${basePreview}/${brickId}`;

export const coverRoute = basePlayRoute + routes.PlayCoverLastPrefix;
export const sectionsRoute = basePlayRoute + routes.PlaySectionsLastPrefix;
export const briefRoute = basePlayRoute + routes.PlayBriefLastPrefix;
export const newPrepRoute = basePlayRoute + routes.PlayNewPrepLastPrefix;
export const liveRoute = basePlayRoute + routes.PlayLiveLastPrefix;
export const synthesisRoute = basePlayRoute + routes.PlaySynthesisLastPrefix;
export const reviewRoute = basePlayRoute + routes.PlayReviewLastPrefix;


export const previewCover = (brickId: number) => preview(brickId) + routes.PlayCoverLastPrefix;
export const previewSections = (brickId: number) => preview(brickId) + routes.PlaySectionsLastPrefix;
export const previewBrief = (brickId: number) => preview(brickId) + routes.PlayBriefLastPrefix;
export const previewNewPrep = (brickId: number) => preview(brickId) + routes.PlayNewPrepLastPrefix;
export const previewNewPrepResume = (brickId: number) => preview(brickId) + routes.PlayNewPrepLastPrefix + "?resume=true";
export const previewLive = (brickId: number) => preview(brickId) + routes.PlayLiveLastPrefix;
export const previewSynthesis = (brickId: number) => preview(brickId) + routes.PlaySynthesisLastPrefix;
export const previewReview = (brickId: number) => preview(brickId) + routes.PlayReviewLastPrefix;


export default {
  coverRoute,
  sectionsRoute,
  briefRoute,
  newPrepRoute,
  liveRoute,
  synthesisRoute,
  reviewRoute,

  previewCover,
  previewSections,
  previewBrief,
  previewNewPrep,
  previewNewPrepResume,
  previewLive,
  previewSynthesis,
  previewReview
}
