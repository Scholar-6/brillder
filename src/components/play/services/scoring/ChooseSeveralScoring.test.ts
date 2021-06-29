import mark from './ChooseSeveralScoring';

import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { ComponentAttempt } from 'components/play/model';
import { ChooseSeveralComponent, ChooseSeveralAnswer } from 'components/play/questionTypes/choose/chooseSeveral/ChooseSeveral'

describe("3 options 2 correct", () => {
  let mockComponent: ChooseSeveralComponent = {
    type: 127,
    list: [
      { index: 1, value: "A", valueFile: "", answerType: QuestionValueType.String, checked: true },
      { index: 2, value: "B", valueFile: "", answerType: QuestionValueType.String, checked: false },
      { index: 3, value: "C", valueFile: "", answerType: QuestionValueType.String, checked: true },
    ],
  };

  it("should give no marks for no options selected", () => {
    // arrange
    const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = { answer: [], correct: false, marks: 0, maxMarks: 0, attempted: true, questionId: 1};

    // act
    const result = mark(mockComponent, mockAttempt);

    // assert
    expect(result.marks).toStrictEqual(0);
    expect(result.maxMarks).toStrictEqual(4);
    expect(result.correct).toStrictEqual(false);
  });

  it("should give full marks for all correct options selected", () => {
    // arrange
    const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = { 
      answer: [ {shuffleIndex: 2, realIndex: 0}, {shuffleIndex: 1, realIndex: 2} ], 
      correct: false, marks: 0, maxMarks: 0, attempted: true, questionId: 1
    };

    // act
    const result = mark(mockComponent, mockAttempt);

    // assert
    expect(result.marks).toStrictEqual(4);
    expect(result.maxMarks).toStrictEqual(4);
    expect(result.correct).toStrictEqual(true);
  });

  it("should give 1 mark for 1 option correct and 1 missed", () => {
    // arrange
    const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = { 
      answer: [ {shuffleIndex: 2, realIndex: 0} ], 
      correct: false, marks: 0, maxMarks: 0, attempted: true, questionId: 1
    };

    // act
    const result = mark(mockComponent, mockAttempt);

    // assert
    expect(result.marks).toStrictEqual(1);
    expect(result.maxMarks).toStrictEqual(4);
    expect(result.correct).toStrictEqual(false);
  });

});

describe("6 options 4 correct", () => {
  let mockComponent: ChooseSeveralComponent = {
    type: 127,
    list: [
      { index: 1, value: "A", valueFile: "", answerType: QuestionValueType.String, checked: true },
      { index: 2, value: "B", valueFile: "", answerType: QuestionValueType.String, checked: false },
      { index: 3, value: "C", valueFile: "", answerType: QuestionValueType.String, checked: true },
      { index: 4, value: "", valueFile: "123.jpg", answerType: QuestionValueType.String, checked: true, imageCaption: "D", imagePermision: true, imageSource: "attribution" },
      { index: 4, value: "", valueFile: "456.jpg", answerType: QuestionValueType.String, checked: false, imageCaption: "E", imagePermision: true, imageSource: "attribution" },
      { index: 5, value: "", valueFile: "", answerType: QuestionValueType.String, soundFile: "123.mp3", checked: true, soundCaption: "F" },
      { index: 5, value: "", valueFile: "", answerType: QuestionValueType.String, soundFile: "456.mp3", checked: false, soundCaption: "G" },
    ],
  };

  it("should give no marks for no options selected", () => {
    // arrange
    const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = { answer: [], correct: false, marks: 0, maxMarks: 0, attempted: true, questionId: 1};

    // act
    const result = mark(mockComponent, mockAttempt);

    // assert
    expect(result.marks).toStrictEqual(0);
    expect(result.maxMarks).toStrictEqual(8);
    expect(result.correct).toStrictEqual(false);
  });

  it("should give full marks for all correct options selected", () => {
    // arrange
    const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = { 
      answer: [ {shuffleIndex: 2, realIndex: 0}, {shuffleIndex: 1, realIndex: 2}, {shuffleIndex: 4, realIndex: 3}, {shuffleIndex: 3, realIndex:5}, ], 
      correct: false, marks: 0, maxMarks: 0, attempted: true, questionId: 1
    };

    // act
    const result = mark(mockComponent, mockAttempt);

    // assert
    expect(result.marks).toStrictEqual(8);
    expect(result.maxMarks).toStrictEqual(8);
    expect(result.correct).toStrictEqual(true);
  });

  it("should give 2 mark for 2 options correct and 2 missed", () => {
    // arrange
    const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = { 
      answer: [ {shuffleIndex: 2, realIndex: 0}, {shuffleIndex: 1, realIndex: 2}, ],
      correct: false, marks: 0, maxMarks: 0, attempted: true, questionId: 1
    };

    // act
    const result = mark(mockComponent, mockAttempt);

    // assert
    expect(result.marks).toStrictEqual(2);
    expect(result.maxMarks).toStrictEqual(8);
    expect(result.correct).toStrictEqual(false);
  });
  
});
