import React from 'react';
import { render } from '@testing-library/react';
import HorizontalShuffle, {HorizontalShuffleComponent} from './HorizontalShuffle';
import { QuestionComponentTypeEnum, Question } from 'model/question';
import { HintStatus } from 'model/question';


describe("Horizontal Shuffle play", () => {
  it("should create Horizontal Shuffle", () => {
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
    let component: HorizontalShuffleComponent = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "",
      }],
    }
    render(
      <HorizontalShuffle
        component={component}
        answers={-1}
        question={question}
        isTimeover={false}
        attempt={null}
        isPreview={false}
        onAttempted={() => { }}
      />
    );
  });
})