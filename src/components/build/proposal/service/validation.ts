import { Brick } from "model/brick";
import { stripHtml } from "components/build/questionService/ConvertService";
import routes from "components/build/routes";

export interface ValidateProposalResult {
  isValid: boolean;
  url: string;
}

export function validateProposal(brick: Brick) {
  let isValid = true;
  let url = routes.buildPlan(brick.id);

  if (!brick.subjectId) {
    url = routes.buildSubject(brick.id);
    isValid = false;
  } else if (!brick.title || brick.academicLevel < 1 || brick.keywords.length === 0) {
    url = routes.buildTitle(brick.id);
    isValid = false;
  } else if (!stripHtml(brick.openQuestion)) {
    url = routes.buildOpenQuestion(brick.id);
    isValid = false;
  } else if (!stripHtml(brick.brief)) {
    url = routes.buildBrief(brick.id);
    isValid = false;
  } else if (!stripHtml(brick.prep)) {
    url = routes.buildPrep(brick.id);
    isValid = false;
  } else if (!brick.brickLength) {
    url = routes.buildLength(brick.id);
    isValid = false;
  }
  url = url.replace(":brickId", brick.id.toString());
  return { isValid, url };
}
