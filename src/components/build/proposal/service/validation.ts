import { Brick } from "model/brick";
import map from 'components/map';

export interface ValidateProposalResult {
  isValid: boolean;
  url: string;
}

export function validateProposal(brick: Brick) {
  let isValid = true;
  let url = map.ProposalReview;
  if (!brick.subjectId) {
    url = map.ProposalSubject;
    isValid = false;
  } else if (!brick.title || !brick.subTopic || !brick.alternativeTopics) {
    url = map.ProposalTitle;
    isValid = false;
  } else if (!brick.openQuestion) {
    url = map.ProposalOpenQuestion;
    isValid = false;
  } else if (!brick.brief) {
    url = map.ProposalBrief;
    isValid = false;
  } else if (!brick.prep) {
    url = map.ProposalPrep;
    isValid = false;
  } else if (!brick.brickLength) {
    url = map.ProposalLength;
    isValid = false;
  }
  return { isValid, url };
}
