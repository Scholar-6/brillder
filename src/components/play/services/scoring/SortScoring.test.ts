import { QuestionValueType } from 'components/interfaces/sort';
import { ComponentAttempt } from 'components/play/model';
import { SortComponent } from 'components/play/questionTypes/sort/Sort';
import mark from './SortScoring';

const mockComponent: SortComponent = {
    type: 127,
    categories: [
        { name: "0", height: "Height", answers: [
            { answerType: QuestionValueType.String, value: "0_0", valueFile: "" },
        ] },
        { name: "1", height: "Height", answers: [
            { answerType: QuestionValueType.String, value: "1_0", valueFile: "" },
        ] },
        { name: "2", height: "Height", answers: [
            { answerType: QuestionValueType.String, value: "2_0", valueFile: "" },
            { answerType: QuestionValueType.String, value: "2_1", valueFile: "" },
        ] },
    ]
} as SortComponent;

describe("sort scoring", () => {

    it("should mark a correct answer with 4 marks", () => {
        // arrange
        const mockAttempt = {
            answer: {
                "0": 0,
                "1": 1,
                "2_0": 2,
                "2_1": 2,
            }
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(4);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark an incorrect answer with 0", () => {
        const mockAttempt = {
            answer: {
                "2_1": 1,
                "0": 2,
                "2_2": 1,
                "1": 0
            }
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark a blank answer with 0", () => {
        const mockAttempt = {
            answer: {
                "0": 3,
                "1": 3,
                "2_0": 3,
                "2_1": 3
            }
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark an attempted answer with 1 for each correctly placed", () => {
        const mockAttempt = {
            answer: {
                "0": 0,
                "1": 1,
                "2_0": 1,
                "2_1": 3
            }
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(2);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

});