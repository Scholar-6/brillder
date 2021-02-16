export enum ProposalStep {
  Subject = 1,
  BrickTitle = 2,
  OpenQuestion = 3,
  BrickLength = 4,
  Brief = 5,
  Prep = 6,
  Synthesis = 7,
  ProposalReview = 8,
}

export enum BrickFieldNames {
  openQuestion = "openQuestion",
  brief = "brief",
  prep = "prep",
  title = "title",
  synthesis = "synthesis"
};

export enum PlayButtonStatus {
  Hidden,
  Invalid,
  Valid
};

export const TitleRoutePart = '/brick-title';
export const OpenQuestionRoutePart = '/open-question';
export const BrickLengthRoutePart = '/length';
export const BriefRoutePart = '/brief';
export const PrepRoutePart = '/prep';
export const ProposalReviewPart = '/plan';
