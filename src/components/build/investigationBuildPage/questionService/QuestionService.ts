import { Question, QuestionTypeEnum, QuestionComponentTypeEnum, QuestionType } from 'model/question';

const getUniqueComponent = (components: any[]) => {
  return components.find(c => c.type === QuestionComponentTypeEnum.Component);
}

const validateNotEmptyAnswer = (comp: any) => {
  if (comp.list && comp.list.length >= 1) {
    let invalid = comp.list.find((a:any) => !a.value);
    if (invalid) {
      return false;
    }
    return true;
  }
  return false;
}

const validateCheckedAnswer = (comp: any) => {
  if (comp.list && comp.list.length > 1) {
    let invalid = comp.list.find((a:any) => !a.value);
    if (invalid) {
      return false;
    }
    let checked = comp.list.find((a:any) => a.checked === true);
    if (checked) {
      return true;
    }
  }
  return false;
}

const validatePairMatch = (comp: any) => {
  if (comp.list && comp.list.length > 1) {
    let invalid = comp.list.find((a:any) => !a.value || !a.option);
    if (invalid) {
      return false;
    }
    return true;
  }
  return false;
}

const validateSort = (comp: any) => {
  if (comp.categories && comp.categories.length > 1) {
    const invalid = comp.categories.find((c:any) => {
      if (!c.name) {
        return true;
      }
      const invalid = c.answers.find((a:any) => !a.value);
      if (invalid) {
        return true;
      }
      return false;
    });
    if (invalid) {
      return false;
    }
    return true;
  }
  return false;
}

const validateWordHighlighting = (comp: any) => {
  if (comp.words && comp.words.length > 1) {
    const valid = comp.words.find((w:any) => w.checked);
    if (valid) {
      return true;
    }
  }
  return false;
}

const validateLineHighlighting = (comp: any) => {
  if (comp.lines && comp.lines.length > 1) {
    const valid = comp.lines.find((l:any) => l.checked);
    if (valid) {
      return true;
    }
  }
  return false;
}

const validateQuestion = (question: Question) => {
  const {type} = question;
  const comp = getUniqueComponent(question.components);
  if (type === QuestionTypeEnum.ShortAnswer || type === QuestionTypeEnum.VerticalShuffle
    || type === QuestionTypeEnum.HorizontalShuffle)
  {
    return validateNotEmptyAnswer(comp);
  } else if (type === QuestionTypeEnum.ChooseOne || type === QuestionTypeEnum.ChooseSeveral) {
    return validateCheckedAnswer(comp);
  } else if (type === QuestionTypeEnum.PairMatch) {
    return validatePairMatch(comp);
  } else if (type === QuestionTypeEnum.Sort) {
    return validateSort(comp);
  } else if (type === QuestionTypeEnum.WordHighlighting) {
    return validateWordHighlighting(comp);
  } else if (type === QuestionTypeEnum.LineHighlighting) {
    return validateLineHighlighting(comp);
  }
  return false;
};

export default validateQuestion;
