import React from 'react';
import { render } from '@testing-library/react';
import MissingWord from './MissingWord';
import { QuestionComponentTypeEnum, Question, QuestionTypeObj } from 'model/question';
import validator from 'components/build/investigationBuildPage/questionService/UniqueValidator';

describe("Missing word play and validation", () => {
  it("should create Missing word", () => {
    let question: Question = {
      id: 66,
      order: 0,
      type: 6
    };
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      choices: [{
        before: "",
        after: "",
        answers: [{
          value: "",
          checked: false
        }],
        value: "",
      }],
    }
    render(
      <MissingWord
        component={component}
        answers={[]}
        question={question}
        attempt={null}
        isPreview={false}
        onAttempted={() => { }}
      />
    );
  });
})