import { stripHtml } from "components/build/questionService/ConvertService";
import { Brick } from "model/brick";

export interface ValidateProposalResult {
  isValid: boolean;
  url: string;
}

export function validateProposal(brick: Brick) {
  let isValid = true;
  const url = `/build/brick/${brick.id}/plan`;

  if (!brick.subjectId) {
    isValid = false;
  } else if (!stripHtml(brick.title) || brick.academicLevel < 1 || brick.keywords.length === 0) {
    isValid = false;
  } else if (!stripHtml(brick.openQuestion)) {
    isValid = false;
  } else if (!stripHtml(brick.brief)) {
    isValid = false;
  } else if (!stripHtml(brick.prep)) {
    isValid = false;
  } else if (!brick.brickLength) {
    isValid = false;
  }
  return { isValid, url };
}
