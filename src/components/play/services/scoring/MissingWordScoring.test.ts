import { ComponentAttempt } from 'components/play/model';
import mark from './MissingWordScoring';

const mockComponent = {
    choices: [
        {
            answers: {
                "A": { checked: true  },
                "B": { checked: false },
                "C": { checked: false },
            }
        },
        {
            answers: {
                "A": { checked: false },
                "B": { checked: true  },
                "C": { checked: false },
            }
        },
        {
            answers: {
                "A": { checked: false },
                "B": { checked: false },
                "C": { checked: true  },
            }
        }
    ]
}

describe("missing word scoring", () => {

    it("should mark a correct answer with 2n marks", () => {
        // arrange
        const mockAttempt = {
            answer: [
                { value: "A" },
                { value: "B" },
                { value: "C" },
            ]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(6);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark an incorrect answer with 0.5n marks", () => {
        // arrange
        const mockAttempt = {
            answer: [
                { value: "B" },
                { value: "C" },
                { value: "A" },
            ]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(1.5);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark a blank answer with 0 marks", () => {
        // arrange
        const mockAttempt = {
            answer: [
                { value: "" },
                { value: "" },
                { value: "" },
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