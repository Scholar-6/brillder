import mark from './ChooseSeveralScoring';

import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { ComponentAttempt } from 'components/play/model';
import { ChooseSeveralAnswer } from 'components/play/questionTypes/choose/chooseSeveral/ChooseSeveral';

const mockComponent: any = {
  type: 127,
  list: [
    { value: "A", valueFile: "", checked: true, answerType: QuestionValueType.String },
    { value: "B", valueFile: "", checked: false, answerType: QuestionValueType.String },
    { value: "C", valueFile: "", checked: true, answerType: QuestionValueType.String },
    { value: "D", valueFile: "", checked: false, answerType: QuestionValueType.String },
    { value: "E", valueFile: "", checked: true, answerType: QuestionValueType.String },
  ],
}

describe("choose one scoring", () => {

  it("should mark a correct answer with 6 marks", () => {
    /* 11/4/2020
    // arrange
    const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = {
        answer: [0, 2, 4]
    } as ComponentAttempt<ChooseSeveralAnswer>;

    // act
    const result = mark(mockComponent, mockAttempt);

    // assert
    expect(result.marks).toStrictEqual(10);
    expect(result.maxMarks).toStrictEqual(10);
    expect(result.correct).toStrictEqual(true);
    */
  });

  /* 11/4/2020
  it("should mark an incorrect answer with 0.5 marks", () => {
      // arrange
      const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = {
          answer: [0, 1, 2, 4]
      } as ComponentAttempt<ChooseSeveralAnswer>;

      // act
      const result = mark(mockComponent, mockAttempt);

      // assert
      expect(result.marks).toStrictEqual(8.5); // 8 + 0.5
      expect(result.maxMarks).toStrictEqual(10);
      expect(result.correct).toStrictEqual(false);
  });

  it("should mark a blank answer with 0 marks", () => {
      // arrange
      const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = {
          answer: [] as number[]
      } as ComponentAttempt<ChooseSeveralAnswer>;

      // act
      const result = mark(mockComponent, mockAttempt);

      // assert
      expect(result.marks).toStrictEqual(0);
      expect(result.maxMarks).toStrictEqual(10);
      expect(result.correct).toStrictEqual(false);
  });

  it("should mark a full answer with 0 marks", () => {
      // arrange
      const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = {
          answer: [0, 1, 2, 3, 4] as number[]
      } as ComponentAttempt<ChooseSeveralAnswer>;

      // act
      const result = mark(mockComponent, mockAttempt);

      // assert
      expect(result.marks).toStrictEqual(0);
      expect(result.maxMarks).toStrictEqual(10);
      expect(result.correct).toStrictEqual(false);
  })
  */
  it("test for #2706", () => {
    let component = {
      chosen: false,
      list: [
        {
          answerType: 1,
          checked: false,
          index: 2,
          soundFile: "",
          value: '<p><span class="latex">63.4</span></p>',
          valueFile: "",
        },
        {
          answerType: 1,
          checked: true,
          index: 4,
          soundFile: "",
          value: '<p><span class="latex">296.6</span></p>',
          valueFile: ""
        },
        {
          answerType: 1,
          checked: false,
          index: 1,
          soundFile: "",
          value: '<p><span class="latex">0</span></p>',
          valueFile: ""
        },
        {
          answerType: 1,
          checked: true,
          index: 8,
          soundFile: "",
          value: '<p style="text-align:justify;"><span class="latex">116.6</span></p>',
          valueFile: ""
        },
        {
          answerType: 1,
          checked: true,
          index: 5,
          soundFile: "",
          value: '<p><span class="latex">180</span></p>',
          valueFile: ""
        },
        {
          answerType: 1,
          index: 7,
          soundFile: "",
          value: '<p style="text-align:justify;"><span class="latex">270</span></p>',
          valueFile: "",
        },
        {
          answerType: 1,
          checked: false,
          index: 9,
          soundFile: "",
          value: '<p style="text-align:justify;"><span class="latex">360</span></p>',
          valueFile: "",
        },
        {
          answerType: 1,
          checked: false,
          index: 0,
          soundFile: "",
          value: '<p><span class="latex">-63.4</span></p>',
          valueFile: "",
        },
        {
          answerType: 1,
          checked: false,
          index: 6,
          soundFile: "",
          value: '<p><span class="latex">476.6</span></p>',
          valueFile: "",
        },
        {
          answerType: 1,
          checked: false,
          index: 3,
          soundFile: "",
          value: '<p><span class="latex">90</span></p>',
          valueFile: ""
        },
      ],
      selected: false,
      type: 127
    } as any;

    const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = {
      answer: [
        { realIndex: 5, shuffleIndex: 4 },
        { realIndex: 8, shuffleIndex: 3 },
        { realIndex: 4, shuffleIndex: 1 },
      ],
      attempted: false,
      correct: false,
      marks: 0,
      maxMarks: 20,
      questionId: 76699,
    } as any;

    const result = mark(component, mockAttempt);

    expect(result.marks).toStrictEqual(20);
    expect(result.maxMarks).toStrictEqual(20);
    expect(result.correct).toStrictEqual(true);
  })
});
