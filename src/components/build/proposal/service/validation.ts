import { stripHtml } from "components/build/questionService/ConvertService";
import { Brick } from "model/brick";
import { User } from "model/user";
import { MaxKeywordLength } from "../questionnaire/brickTitle/components/KeyWords";

export interface ValidateProposalResult {
  isValid: boolean;
  url: string;
}

export function validateProposal(user: User, brick: Brick) {
  let isValid = true;
  const url = `/build/brick/${brick.id}/plan`;

  let isAuthor = false;
  try {
    isAuthor = brick.author.id === user.id;
  } catch { }

  console.log(isAuthor);

  if (!brick.subjectId) {
    isValid = false;
  } else if (!stripHtml(brick.title) || brick.academicLevel < 1) {
    isValid = false;
  } else if (!stripHtml(brick.openQuestion)) {
    isValid = false;
  } else if (!stripHtml(brick.brief)) {
    isValid = false;
  } else if (!stripHtml(brick.prep)) {
    isValid = false;
  } else if (!brick.brickLength) {
    isValid = false;
  } else if (!isAuthor) {
    if (brick.keywords.length === 0) {
      isValid = false;
    }
    for (let k of brick.keywords) {
      if (k.name.length >= MaxKeywordLength) {
        isValid = false;
        break;
      }
    }
  }
  console.log(isValid);
  return { isValid, url };
}
