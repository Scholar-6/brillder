import {QuestionValueType} from '../buildQuestions/questionTypes/types';
import { Answer } from '../buildQuestions/questionTypes/pairMatchBuild/types';
import { MissingChoice } from '../buildQuestions/questionTypes/missingWordBuild/MissingWordBuild';
import { stripHtml } from './ConvertService';


const getChecked = (list: any[]) => {
  return list.find((a:any) => a.checked === true);
}

const validateImageSoundAndText = (a: any) => {
  if (a.answerType === QuestionValueType.Image) {
    return !stripHtml(a.valueFile);
  } else if (a.answerType === QuestionValueType.Sound) {
    return !stripHtml(a.soundFile);
  }
  return !stripHtml(a.value);
}

const validateShortAnswerOrShuffle = (comp: any) => {
  if (comp.list && comp.list.length >= 1) {
    let invalid = comp.list.find((a:any) => !(!!stripHtml(a.value) || !!stripHtml(a.valueFile) || !!stripHtml(a.soundFile)));
    if (invalid) {
      return false;
    }
    return true;
  }
  return false;
}

const validateChooseOne = (comp: any) => {
  if (comp.list && comp.list.length > 1) {
    let invalid = comp.list.find(validateImageSoundAndText);
    if (invalid) {
      return false;
    }
    let checked = getChecked(comp.list);
    if (checked) {
      return true;
    }
  }
  return false;
}

const validateChooseSeveralChecked = (list: any[]) => {
  let checkedCount = 0;
  for (let choice of list) {
    if (choice.checked) {
      checkedCount++;
    }
  }
  if (checkedCount >= 2) {
    return true;
  }
  return false;
}

const validateChooseSeveral = (comp: any) => {
  if (comp.list && comp.list.length > 1) {
    let invalid = comp.list.find(validateImageSoundAndText);
    if (invalid) {
      return false;
    }
    return validateChooseSeveralChecked(comp.list);
  }
  return false;
}


const validatePairMatch = (comp: any) => {
  const validateChoice = (a: Answer) => {
    if (a.answerType === QuestionValueType.Image && !a.valueFile) {
      return false;
    } else if (a.answerType !== QuestionValueType.Image && a.answerType !== QuestionValueType.Sound && !a.value) {
      return false;
    }
    return true;
  }

  const validateOption = (a: Answer) => {
    if (a.optionType === QuestionValueType.Image && !a.optionFile) {
      return false;
    } else if (a.optionType !== QuestionValueType.Image && a.optionType !== QuestionValueType.Sound && !a.option) {
      return false;
    }
    return true;
  }

  const getInvalid = (a:Answer) => {
    if (!validateChoice(a)) {
      return true;
    }

    if (!validateOption(a)) {
      return true;
    }

    return false;
  }

  if (comp.list && comp.list.length > 1) {
    let invalid = comp.list.find(getInvalid);
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
      const invalid = c.answers.find(validateImageSoundAndText);
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
  
const validateMissingWord = (comp: any) => {
  if (!comp.choices) {
    return false;
  }

  for (let choice of comp.choices as MissingChoice[]) {
    let invalid = choice.answers.find((a:any) => !a.value);
  
    if (invalid) {
      return false;
    }
     
    let checked = getChecked(choice.answers);
    if (!checked) {
      return false;
    }
  }
  return true;
}


export default {
  validateShortAnswerOrShuffle,
  getChecked,
  validateChooseOne,
  validateChooseSeveralChecked,
  validateChooseSeveral,
  validatePairMatch,
  validateSort,
  validateMissingWord,
  validateWordHighlighting,
  validateLineHighlighting,
}