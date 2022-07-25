export enum ProposalStep {
  Subject = 1,
  AlternateSubject = 2,
  BrickTitle = 3,
  OpenQuestion = 4,
  BrickLength = 5,
  Brief = 6,
  Prep = 7,
  Synthesis = 8,
  ProposalReview = 9,
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

export const SubjectRoutePart = '/subject';
export const AlternateSubjectRoutePart = '/alternateSubject';
export const TitleRoutePart = '/brick-title';
export const OpenQuestionRoutePart = '/open-question';
export const BrickLengthRoutePart = '/length';
export const BriefRoutePart = '/brief';
export const PrepRoutePart = '/prep';
export const ProposalReviewPart = '/plan';
