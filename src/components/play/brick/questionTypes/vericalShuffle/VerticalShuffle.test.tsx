import React from 'react';
import { render } from '@testing-library/react';
import VerticalShuffle, {VerticalShuffleComponent} from './VerticalShuffle';
import { QuestionComponentTypeEnum, Question } from 'model/question';


describe("Horizontal Shuffle play", () => {
  it("should create Horizontal Shuffle", () => {
    let question: Question = {
      id: 66,
      order: 0,
      type: 6
    };
    let component: VerticalShuffleComponent = {
      type: QuestionComponentTypeEnum.Component,
      list: [{
        value: "",
        index: 1,
      }],
    }
  });
})