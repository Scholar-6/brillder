import React from 'react';
import { render } from '@testing-library/react';
import LineHighlighting from './LineHighlighting';
import { QuestionComponentTypeEnum, Question } from 'model/question';
import validator from 'components/build/questionService/UniqueValidator';

describe("Line Highlighting play and validation", () => {
  it("should create Line Highlighting", () => {
    let question: Question = {
      id: 66,
      order: 0,
      type: 6
    };
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      lines: [],
      text: ""
    }
    render(
      <LineHighlighting
        component={component}
        answers={[]}
        question={question}
        attempt={null}
        isPreview={false}
        onAttempted={() => { }}
      />
    );
  });
  
  // tests for validation service
  // value and option should be filled in pair match
  it("Test validation. should be valid", () => {
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      lines: [{
        text: "test",
        checked: true
      },{
        text: "test",
        checked: true
      }],
    }
    let res = validator.validateLineHighlighting(component);
    expect(res).toBe(true);
  });

  it("Test validation. Checked answer required. should be invalid", () => {
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      lines: [{
        text: "test",
        checked: false
      },{
        text: "test",
        checked: false
      }],
    }
    let res = validator.validateMissingWord(component);
    expect(res).toBe(false);
  });
})