import mark from './WordHighlightingScoring';

import { ComponentAttempt } from 'components/play/model';
import { IPlayWordComponent } from 'components/interfaces/word';

const mockComponent = {
    words: [
        { text: "A", checked: false },
        { text: "B", checked: true },
        { text: "C", checked: false },
        { text: "D", checked: true },
        { text: "E", checked: false },
        { text: "F", checked: true },
    ]
} as IPlayWordComponent;

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