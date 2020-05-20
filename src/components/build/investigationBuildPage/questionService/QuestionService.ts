import {
  HintStatus, QuestionComponentTypeEnum, Question
} from "model/question";


export function getNewQuestion(type: number, active: boolean) {
  return {
    type,
    active,
    hint: {
      value: "",
      list: [] as string[],
      status: HintStatus.None
    },
    components: [
      { type: 0 },
      { type: QuestionComponentTypeEnum.Component },
      { type: 0 }
    ]
  } as Question;
};

export function deactiveQuestions(questions: Question[]) {
  const updatedQuestions = questions.slice();
  updatedQuestions.forEach(q => (q.active = false));
  return updatedQuestions;
}

export function activeQuestionByIndex(questions: Question[], index: number) {
  const updatedQuestions = deactiveQuestions(questions);
  updatedQuestions[index].active = true;
  return updatedQuestions;
}

export function getUniqueComponent(question: Question) {
  return question.components.find(
    c => c.type === QuestionComponentTypeEnum.Component
  );
}

export function getActiveQuestion(questions: Question[]) {
  return questions.find(q => q.active === true) as Question;
}