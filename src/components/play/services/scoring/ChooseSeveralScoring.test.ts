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
/*
  it("should mark an correct answer with 6 marks", () => {
    // arrange
    const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = {
        answer: [0, 2, 4] as number[]
    } as any;

    // act
    const result = mark(mockComponent, mockAttempt);

    // assert
    expect(result.marks).toStrictEqual(6); // full marks
    expect(result.maxMarks).toStrictEqual(6);
    expect(result.correct).toStrictEqual(true);
});*/


  /*it("should mark a correct answer with 5 marks", () => {
     11/4/2020
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
    
  });*/

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




  
  it("#2706 Correct answer marked wrong in review", () => {
    let component = {
      chosen: false,
      list: [
        {
          answerType: 1,
          checked: false,
          index: 2,
          soundFile: "",
          value: 'A',
          valueFile: "",
        },
        {
          answerType: 1,
          checked: true,
          index: 3,
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
          index: 0,
          soundFile: "",
          value: '<p style="text-align:justify;"><span class="latex">116.6</span></p>',
          valueFile: ""
        },
        
      ],
      selected: true,
      type: 127
    } as any;

    const mockAttempt: ComponentAttempt<ChooseSeveralAnswer> = {
      answer: [
        { realIndex: 3, shuffleIndex: 1 },
        { realIndex: 0, shuffleIndex: 3 },
      ],
      attempted: true,
      correct: true,
      marks: 4,
      maxMarks: 4,
      questionId: 76699,
    } as any;

    const result = mark(component, mockAttempt);

    expect(result.marks).toStrictEqual(4);
    expect(result.maxMarks).toStrictEqual(4);
    expect(result.correct).toStrictEqual(true);
  })
  
});
