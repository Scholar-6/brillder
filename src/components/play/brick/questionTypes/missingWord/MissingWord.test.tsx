import React from 'react';
import { render } from '@testing-library/react';
import MissingWord from './MissingWord';
import { QuestionComponentTypeEnum, Question } from 'model/question';
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
  
  // tests for validation service
  // value and option should be filled in pair match
  it("Test validation. should be valid", () => {
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      choices: [{
        before: "",
        after: "",
        answers: [{
          value: "test",
          checked: true
        },{
          value: "test",
          checked: false
        }],
      }],
    }
    let res = validator.validateMissingWord(component);
    expect(res).toBe(true);
  });
  it("Test validation. Value text required. should be invalid", () => {
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      choices: [{
        before: "",
        after: "",
        answers: [{
          value: "",
          checked: true
        },{
          value: "test",
          checked: false
        }],
      }],
    }
    let res = validator.validateMissingWord(component);
    expect(res).toBe(false);
  });
  it("Test validation. Checked answer required. should be invalid", () => {
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      choices: [{
        before: "",
        after: "",
        answers: [{
          value: "test",
          checked: false
        },{
          value: "test",
          checked: false
        }],
      }],
    }
    let res = validator.validateMissingWord(component);
    expect(res).toBe(false);
  });
})