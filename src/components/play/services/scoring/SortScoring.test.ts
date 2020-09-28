import { QuestionValueType } from 'components/interfaces/sort';
import { ComponentAttempt } from 'components/play/model';
import { SortComponent } from 'components/play/questionTypes/sort/Sort';
import mark from './SortScoring';

const mockComponent: SortComponent = {
    type: 127,
    categories: [
        { name: "A", height: "Height", answers: [
            { answerType: QuestionValueType.String, value: "A", valueFile: "" },
        ] },
        { name: "B", height: "Height", answers: [
            { answerType: QuestionValueType.String, value: "B", valueFile: "" },
        ] },
        { name: "C", height: "Height", answers: [
            { answerType: QuestionValueType.String, value: "C", valueFile: "" },
            { answerType: QuestionValueType.String, value: "D", valueFile: "" },
        ] },
    ]
} as SortComponent;

describe("sort scoring", () => {

    it("should mark a correct answer with n marks", () => {
        // arrange
        const mockAttempt = {
            answer: {
                "A": 0,
                "B": 1,
                "C": 2,
                "D": 2,
            }
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(4);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark an incorrect answer with 0.25 each", () => {
        const mockAttempt = {
            answer: {
                "A": 1,
                "B": 2,
                "C": 1,
                "D": 0
            }
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(1);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark a blank answer with 0 each", () => {
        const mockAttempt = {
            answer: {
                "A": 3,
                "B": 3,
                "C": 3,
                "D": 3
            }
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

});