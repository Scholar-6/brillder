import mark from './ChooseSeveralScoring';

import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { ComponentAttempt } from 'components/play/model';
import { ChooseSeveralAnswer } from 'components/play/questionTypes/choose/chooseSeveral/ChooseSeveral';

const mockComponent: any = {
    type: 127,
    list: [
        { value: "A", valueFile: "", checked: true,  answerType: QuestionValueType.String },
        { value: "B", valueFile: "", checked: false, answerType: QuestionValueType.String },
        { value: "C", valueFile: "", checked: true,  answerType: QuestionValueType.String },
        { value: "D", valueFile: "", checked: false, answerType: QuestionValueType.String },
        { value: "E", valueFile: "", checked: true,  answerType: QuestionValueType.String },
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
});