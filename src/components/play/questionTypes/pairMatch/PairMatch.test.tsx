import React from 'react';
import { render } from '@testing-library/react';
import PairMatch from './PairMatch';
import { PairMatchComponent } from './interface';
import { QuestionComponentTypeEnum, Question } from 'model/question';
import validator from 'components/build/questionService/UniqueValidator';

describe("Pair match play and validation", () => {
  it("should create PairMatch", () => {
    /* 11/4/2020
    let question: Question = {
      id: 66,
      order: 0,
      type: 6
    };
    let component: PairMatchComponent = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "",
        index: 1,
        hint: "",
        option: ""
      }],
      choices:[],
      options:[]
    }
    render(
      <PairMatch
        component={component}
        answers={-1}
        question={question}
        attempt={null}
        isPreview={false}
        onAttempted={() => { }}
      />
    );
    */
  });

  /* 11/4/2020
  // tests for validation service
  // value and option should be filled in pair match
  it("Test validation. should be valid", () => {
    let component: PairMatchComponent = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "test",
        index: 1,
        hint: "",
        option: "test"
      }, {
        value: "test",
        index: 2,
        hint: "",
        option: "test"
      }, {
        value: "test",
        index: 3,
        hint: "",
        option: "test"
      }],
      choices:[],
      options:[]
    }
    let res = validator.validatePairMatch(component);
    expect(res).toBe(true);
  });
  it("Test empty value. should be invalid", () => {
    let component: PairMatchComponent = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "",
        index: 1,
        hint: "",
        option: "test"
      }, {
        value: "test",
        index: 2,
        hint: "",
        option: "test"
      }, {
        value: "test",
        index: 3,
        hint: "",
        option: "test"
      }],
      choices:[],
      options:[]
    }
    let res = validator.validatePairMatch(component);
    expect(res).toBe(false);
  });
  it("Test empty option. should be invalid", () => {
    let component: PairMatchComponent = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "test",
        index: 1,
        hint: "",
        option: ""
      }, {
        value: "test",
        index: 2,
        hint: "",
        option: "test"
      }, {
        value: "test",
        index: 3,
        hint: "",
        option: "test"
      }],
      choices:[],
      options:[]
    }
    let res = validator.validatePairMatch(component);
    expect(res).toBe(false);
  });
  */
})