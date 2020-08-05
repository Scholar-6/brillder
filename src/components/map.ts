export const Build = '/build';
export const ProposalBase = `${Build}/new-brick`;

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

  playPreviewIntro
}