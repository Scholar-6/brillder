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
  subTopic = "subTopic",
  alternativeTopics = "alternativeTopics",
  synthesis = "synthesis"
};

export enum PlayButtonStatus {
  Hidden,
  Invalid,
  Valid
};
