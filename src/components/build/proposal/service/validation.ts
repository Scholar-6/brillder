import { Brick } from "model/brick";
import { stripHtml } from "components/build/questionService/ConvertService";

export interface ValidateProposalResult {
  isValid: boolean;
  url: string;
}

export function validateProposal(brick: Brick) {
  let isValid = true;
  let urlPrefix = `/build/brick/${brick.id}`;
  let url = urlPrefix + '/plan';

  if (!brick.subjectId) {
    url = urlPrefix + '/subject';
    isValid = false;
  } else if (!brick.title || brick.academicLevel < 1 || brick.keywords.length === 0) {
    url = urlPrefix + '/brick-title';
    isValid = false;
  } else if (!stripHtml(brick.openQuestion)) {
    url = urlPrefix + '/open-question';
    isValid = false;
  } else if (!stripHtml(brick.brief)) {
    url = urlPrefix + '/brief';
    isValid = false;
  } else if (!stripHtml(brick.prep)) {
    url = urlPrefix + '/prep';
    isValid = false;
  } else if (!brick.brickLength) {
    url = urlPrefix + '/length';
    isValid = false;
  }
  url = url.replace(":brickId", brick.id.toString());
  return { isValid, url };
}
