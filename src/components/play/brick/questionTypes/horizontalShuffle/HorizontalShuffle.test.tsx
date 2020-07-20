import React from 'react';
import { render } from '@testing-library/react';
import HorizontalShuffle, {HorizontalShuffleComponent} from './HorizontalShuffle';
import { QuestionComponentTypeEnum, Question } from 'model/question';


describe("Horizontal Shuffle play", () => {
  it("should create Horizontal Shuffle", () => {
    let question: Question = {
      id: 66,
      order: 0,
      type: 6
    };
    let component: HorizontalShuffleComponent = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "",
      }],
    }
  });
})