import routes from "components/play/routes";

const previewBase = '/play-preview/brick';
const prevRoute = `${previewBase}/:brickId`;
const prevLink = (brickId: number) => `${previewBase}/${brickId}`;

export const newPrepRoute = prevRoute + routes.PlayNewPrepLastPrefix;
export const preInvestigationRoute = prevRoute + routes.PlayPreInvestigationLastPrefix;
export const preLiveRoute = prevRoute + routes.PlayLiveLastPrefix;
export const preSynthesisRoute = prevRoute + routes.PlayPreSynthesisLastPrefix;
export const synthesisRoute = prevRoute + routes.PlaySynthesisLastPrefix;
export const preReviewRoute = prevRoute + routes.PlayPreReviewLastPrefix;
export const reviewRoute = prevRoute + routes.PlayReviewLastPrefix;

export const previewNewPrep = (brickId: number) => prevLink(brickId) + routes.PlayNewPrepLastPrefix;
export const previewPreInvesigation = (brickId: number) => prevLink(brickId) + routes.PlayPreInvestigationLastPrefix;
export const previewInvesigation = (brickId: number) => prevLink(brickId) + routes.PlayPreInvestigationLastPrefix;
export const previewLive = (brickId: number) => prevLink(brickId) + routes.PlayLiveLastPrefix;
export const previewPreSynthesis = (brickId: number) => prevLink(brickId) + routes.PlayPreSynthesisLastPrefix;
export const previewSynthesis = (brickId: number) => prevLink(brickId) + routes.PlaySynthesisLastPrefix;
export const previewPreReview = (brickId: number) => prevLink(brickId) + routes.PlayPreReviewLastPrefix;
export const previewReview = (brickId: number) => prevLink(brickId) + routes.PlayReviewLastPrefix;

export default {
  newPrepRoute,
  preInvestigationRoute,
  preLiveRoute,
  preSynthesisRoute,
  synthesisRoute,
  preReviewRoute,
  reviewRoute,

  previewNewPrep,
  previewPreInvesigation,
  previewLive,
  previewPreSynthesis,
  previewSynthesis,
  previewPreReview,
  previewReview
}
