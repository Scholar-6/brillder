import React from 'react';
import { render } from '@testing-library/react';
import QuestionPanelWorkArea from './questionPanelWorkArea';
import { QuestionComponentTypeEnum, Question } from 'model/question';
import { HintStatus } from 'model/question';

describe("Panel Work Area", () => {
  it("should create Panel Work Area", () => {
    let question: Question = {
      id: 66,
      order: 0,
      type: 6,
      hint: {
        value: "",
        list: ["", ""],
        status: HintStatus.Each
      }
    };
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "",
        index: 1,
        hint: "",
        checked: false,
      }],
    }
    render(
      <QuestionPanelWorkArea
        brickId={1}
        canEdit={true}
        locked={false}
        question={question}
        history={null}
        questionsCount={1}
        synthesis={""}
        validationRequired={true}
        saveBrick={() => { }}
        setQuestion={() => { }}
        updateComponents={() => { }}
        setQuestionType={() => { }}
        nextOrNewQuestion={() => { }}
        getQuestionIndex={() => 1}
        setPreviousQuestion={() => { }}
        toggleLock={() => { }}
      />
    );
  });
});
