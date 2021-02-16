import { Brick } from "model/brick";
import map from 'components/map';
import { stripHtml } from "components/build/questionService/ConvertService";

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
  } else if (!brick.title || brick.academicLevel < 1 || brick.keywords.length === 0) {
    url = map.ProposalTitle;
    isValid = false;
  } else if (!stripHtml(brick.openQuestion)) {
    url = map.ProposalOpenQuestion;
    isValid = false;
  } else if (!stripHtml(brick.brief)) {
    url = map.ProposalBrief;
    isValid = false;
  } else if (!stripHtml(brick.prep)) {
    url = map.ProposalPrep;
    isValid = false;
  } else if (!brick.brickLength) {
    url = map.ProposalLength;
    isValid = false;
  }
  url = url.replace(":brickId", brick.id.toString());
  return { isValid, url };
}
