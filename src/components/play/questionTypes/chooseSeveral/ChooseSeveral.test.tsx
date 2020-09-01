import React from 'react';
import { render } from '@testing-library/react';
import ChooseSeveral from './ChooseSeveral';
import { QuestionComponentTypeEnum, Question } from 'model/question';
import { HintStatus } from 'model/question';
import validator from 'components/build/investigationBuildPage/questionService/UniqueValidator';

describe("Choose Several play and validation", () => {
  it("should create Choose Several", () => {
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
      <ChooseSeveral
        component={component}
        answers={[]}
        question={question}
        attempt={null}
        isPreview={false}
        onAttempted={() => { }}
      />
    );
  });

  it("Test validation. should be valid", () => {
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "test",
        checked: true,
      }, {
        value: "test",
        checked: true,
      }, {
        value: "test",
        checked: false,
      }],
    }
    let res = validator.validateChooseSeveral(component);
    expect(res).toBe(true);
  });

  it("Test validation. Value is empty. should be invalid", () => {
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "",
        checked: true,
      }, {
        value: "test",
        checked: true,
      }, {
        value: "test",
        checked: false,
      }],
    }
    let res = validator.validateChooseSeveral(component);
    expect(res).toBe(false);
  });

  it("Test validation. Less then two checked. should be invalid", () => {
    let component: any = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "test",
        checked: true,
      }, {
        value: "test",
        checked: false,
      }, {
        value: "test",
        checked: false,
      }],
    }
    let res = validator.validateChooseSeveral(component);
    expect(res).toBe(false);
  });
});
