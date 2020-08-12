export const Build = '/build';
export const ProposalBase = `${Build}/new-brick`;
export const BackToWorkPage = '/back-to-work';
export const ViewAllPage = '/play/dashboard';

export const InvestigationBuild = (brickId: number) => {
  return `/build/brick/${brickId}/build/investigation/question-component`;
}

export const investigationBuildQuestion = (brickId: number, questionId: number) => {
  return InvestigationBuild(brickId) + `/${questionId}`;
}

export const investigationQuestionSuggestions = (brickId: number, questionId: number) => {
  return investigationBuildQuestion(brickId, questionId) + '?suggestionsExpanded=true'
}

// proposal pages
export const ProposalSubject = `${ProposalBase}/subject`;
export const ProposalTitle = `${ProposalBase}/brick-title`;
export const ProposalOpenQuestion = `${ProposalBase}/open-question`;
export const ProposalBrief = `${ProposalBase}/brief`;
export const ProposalPrep = `${ProposalBase}/prep`;
export const ProposalLength = `${ProposalBase}/length`;
export const ProposalReview = `${ProposalBase}/proposal`;


// play preview
export const PlayPreviewBase = '/play-preview/brick';

export const playPreview = (brickId: number) => {
  return  PlayPreviewBase + '/' + brickId;
}

export const playPreviewIntro = (brickId: number) => {
  return playPreview(brickId) + '/intro';
}

export default {
  Build,
  ProposalBase,
  ProposalSubject,
  ProposalTitle,
  ProposalOpenQuestion,
  ProposalBrief,
  ProposalPrep,
  ProposalLength,
  ProposalReview,

  BackToWorkPage,
  ViewAllPage,

  InvestigationBuild,
  investigationBuildQuestion,
  investigationQuestionSuggestions,
  playPreviewIntro
}
