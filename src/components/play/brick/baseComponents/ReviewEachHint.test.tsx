import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewEachHint from './ReviewEachHint';
import { HintStatus } from 'model/question';


describe("EachHint", () => {
  it("should show second each hint in phone preview", () => {
    let hint = {
      value: "",
      list: ["", "Each hint Test. some text"],
      status: HintStatus.Each
    }

    render(<ReviewEachHint isPhonePreview={true} index={1} hint={hint} />);

    const elm = screen.queryByText(hint.list[1]);
    expect(elm).toBeVisible();
  });

  it("should show second each hint when was attempted", () => {
    let hint = {
      value: "",
      list: ["", "Each hint Test. some text"],
      status: HintStatus.Each
    }

    let attempt = {
      answer: null,
      correct: true,
      marks: 1,
      maxMarks: 1,
      attempted: true
    }

    render(<ReviewEachHint attempt={attempt} index={1} hint={hint} />);

    const elm = screen.queryByText(hint.list[1]);
    expect(elm).toBeVisible();
  });
})