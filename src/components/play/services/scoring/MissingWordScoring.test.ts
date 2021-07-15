import { ComponentAttempt } from 'components/play/model';
import mark from './MissingWordScoring';

const mockComponent = {
    choices: [
        {
            answers: [
                { value: "A", checked: true  },
                { value: "B", checked: false },
                { value: "C", checked: false },
            ]
        },
        {
            answers: [
                { value: "A", checked: false },
                { value: "B", checked: true  },
                { value: "C", checked: false },
            ]
        },
        {
            answers: [
                { value: "A", checked: false },
                { value: "B", checked: false },
                { value: "C", checked: true  },
            ]
        }
    ]
}

describe("missing word scoring", () => {

    it("should mark a correct answer with 2n marks", () => {
        // arrange
        const mockAttempt = {
            answer: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
            ]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(6);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark an all incorrect answer with 0 marks", () => {
        // arrange
        const mockAttempt = {
            answer: [
                { value: 1 },
                { value: 2 },
                { value: 0 },
            ]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark 1 out of 3 correct answer as incorrect with 2 marks", () => {
        // arrange
        const mockAttempt = {
            answer: [
                { value: 0 },
                { value: 2 },
                { value: 0 },
            ]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(2);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark a blank answer with 0 marks", () => {
        // arrange
        const mockAttempt = {
            answer: [
                { value: null },
                { value: null },
                { value: null },
            ]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    });

});