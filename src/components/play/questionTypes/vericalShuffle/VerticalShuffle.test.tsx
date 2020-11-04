import React from 'react';
import { render } from '@testing-library/react';
import VerticalShuffle, {VerticalShuffleComponent} from './VerticalShuffle';
import { QuestionComponentTypeEnum, Question } from 'model/question';
import { HintStatus } from 'model/question';

describe("Vertical Shuffle play", () => {
  it("should create Vertical Shuffle", () => {
    /* 11/4/2020
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
    let component: VerticalShuffleComponent = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "",
        index: 1,
      }],
    }
    render(
      <VerticalShuffle
        component={component}
        answers={-1}
        question={question}
        isTimeover={false}
        attempt={null}
        isPreview={false}
        onAttempted={() => { }}
      />
    );*/
  });
})