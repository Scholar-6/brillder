import mark from './LineHighlightingScoring';

import { ComponentAttempt } from 'components/play/model';

const mockComponent = {
    lines: [
        { text: "Line 1", checked: false },
        { text: "Line 2", checked: true },
        { text: "Line 3", checked: false },
        { text: "Line 4", checked: true },
        { text: "Line 5", checked: false },
        { text: "Line 6", checked: true },
    ]
}

describe("line highlighting scoring", () => {

    it("should mark a correct answer with 6 marks", () => {
        // arrange
        const mockAttempt = {
            answer: [1, 3, 5]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(6);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark an incorrect answer with 2 marks", () => {
        // arrange
        const mockAttempt = {
            answer: [2, 3, 5]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(2);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark an blank answer with 0 marks", () => {
        // arrange
        const mockAttempt = {
            answer: []
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    });

});