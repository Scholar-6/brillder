import React from 'react';
import { render } from '@testing-library/react';
import Ending from './Ending';
import { PlayStatus } from "../model";
import { BrickAttempt } from "../model";

describe("Ending play", () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        push: jest.fn(),
      }),
    }));
  });
  it("should create Ending", () => {
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };

    let attempt:BrickAttempt = {
      oldScore: 18,
      score: 19,
      maxScore: 20,
      answers: []
    }

    let brick = {
      brickLength: 1,
      questions: [{}]
    }

    render(
      <Ending
        status={PlayStatus.Ending}
        brick={brick}
        location={{pathname: ''}}
        history={historyMock}
        brickAttempt={attempt}
        move={() => { }}
      />
    );
  });
})