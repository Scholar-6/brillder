import {
  Question, QuestionTypeEnum, QuestionComponentTypeEnum, Hint, HintStatus
} from 'model/question';
import uniqueValidator from './UniqueValidator';

const getUniqueComponent = (components: any[]) => {
  return components && components.find(c => c.type === QuestionComponentTypeEnum.Component);
}

export function getNonEmptyComponent(components: any[]) {
  return !components.find(c =>
    c.type === QuestionComponentTypeEnum.Text ||
    c.type === QuestionComponentTypeEnum.Image ||
    c.type === QuestionComponentTypeEnum.Quote ||
    c.type === QuestionComponentTypeEnum.Sound
  );
}

const validateComponentValues = (components: any[]) => {
  const comps = components.filter(c => {
    return c.type === QuestionComponentTypeEnum.Text
    || c.type === QuestionComponentTypeEnum.Quote
    || c.type === QuestionComponentTypeEnum.Image
    || c.type === QuestionComponentTypeEnum.Sound
  });

  let invalid = comps.find(c => !c.value);
  if (invalid) {
    return false;
  }
  return true;
}

const validateEachHint = (list: any[], answersCount: number) => {
  let index = 0;
  for (let value of list) {
    if (value === null || value === "") {
      return true;
    }
    index++;
    // limit number of hints
    if (index >= answersCount) {
      break;
    }
  }
  return false;
}

export const validateHint = (hint: Hint, answersCount: number) => {
  if (hint.status === HintStatus.Each) {
    return validateEachHint(hint.list, answersCount);
  } else {
    return !hint.value;
  }
}

export const isHintEmpty = (hint: Hint) => {
  if (hint.status === HintStatus.Each) {
    const emptyHint = !hint.list.some(h => h !== "");
    return emptyHint;
  } else {
    return !hint.value;
  }
}

export function validateQuestion(question: Question) {
  const {type, hint, components} = question;

  if (!question.firstComponent || !question.firstComponent.value) {
    return false;
  }

  let isValid = validateComponentValues(components);
  if (!isValid) {
    return false;
  }

  const comp = getUniqueComponent(components);
  if(!comp) {
    return false;
  }

  let answersCount = 1;
  if (comp.list) {
    answersCount = comp.list.length;
  }
  let isHintInvalid = validateHint(hint, answersCount);
  if (isHintInvalid) {
    return false;
  }

  if (type === QuestionTypeEnum.ShortAnswer || type === QuestionTypeEnum.VerticalShuffle
    || type === QuestionTypeEnum.HorizontalShuffle)
  {
    return uniqueValidator.validateShortAnswerOrShuffle(comp);
  } else if (type === QuestionTypeEnum.ChooseOne) {
    return uniqueValidator.validateChooseOne(comp);
  } else if (type === QuestionTypeEnum.ChooseSeveral) {
    return uniqueValidator.validateChooseSeveral(comp);
  } else if (type === QuestionTypeEnum.PairMatch) {
    return uniqueValidator.validatePairMatch(comp);
  } else if (type === QuestionTypeEnum.Sort) {
    return uniqueValidator.validateSort(comp);
  } else if (type === QuestionTypeEnum.WordHighlighting) {
    return uniqueValidator.validateWordHighlighting(comp);
  } else if (type === QuestionTypeEnum.LineHighlighting) {
    return uniqueValidator.validateLineHighlighting(comp);
  } else if (type === QuestionTypeEnum.MissingWord) {
    return uniqueValidator.validateMissingWord(comp);
  }
  return false;
};

export function isHighlightInvalid(question: Question) {
  const {type, components} = question;
  const comp = getUniqueComponent(components);
  if (type === QuestionTypeEnum.WordHighlighting) {
    return uniqueValidator.validateWordHighlighting(comp);
  } else if (type === QuestionTypeEnum.LineHighlighting) {
    return uniqueValidator.validateLineHighlighting(comp);
  }
  return null;
}
