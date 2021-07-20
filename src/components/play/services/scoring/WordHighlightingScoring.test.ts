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

    it("should mark a correct answer with 7 marks on three answers", () => {
        // arrange
        const mockAttempt = {
            answer: [1, 3, 5]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(7);
        expect(result.maxMarks).toStrictEqual(7);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark an incorrect answer with 5 marks", () => {
        // arrange
        const mockAttempt = {
            answer: [2, 3, 5]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(5);
        expect(result.maxMarks).toStrictEqual(7);
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
        expect(result.maxMarks).toStrictEqual(7);
        expect(result.correct).toStrictEqual(false);
    });

});

const mockComponent2 = {
    words: [
        { text: "A", checked: false },
        { text: "B", checked: true },
    ]
} as IPlayWordComponent;

describe("line highlighting scoring (1 answer from 2 options)", () => {

    it("should mark a correct answer with 4 marks", () => {
        // arrange
        const mockAttempt2 = {
            answer: [1]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent2, mockAttempt2);

        // assert
        expect(result.marks).toStrictEqual(4);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark negative points with 0 marks and incorrect", () => {
        // arrange
        const mockAttempt2 = {
            answer: [0]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent2, mockAttempt2);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

    it("if both selected, should mark incorrect with 3 marks", () => {
        //checks that an incorrect choice deducts a point

        // arrange
        const mockAttempt2 = {
            answer: [0, 1]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent2, mockAttempt2);

        // assert
        expect(result.marks).toStrictEqual(3);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

});

const mockComponent3 = {
    words: [
        { text: "A", checked: true },
        { text: "B", checked: true },
        { text: "C", checked: false },
    ]
} as IPlayWordComponent;

describe("line highlighting scoring (2 answers from 3 options)", () => {

    it("should mark a correct answer with 6 marks", () => {
        // arrange
        const mockAttempt3 = {
            answer: [0, 1]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent3, mockAttempt3);

        // assert
        expect(result.marks).toStrictEqual(6);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(true);
    });

    it("if 1 correctly chosen, should mark incorrect with 3 marks", () => {
        // arrange
        const mockAttempt3 = {
            answer: [0]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent3, mockAttempt3);

        // assert
        expect(result.marks).toStrictEqual(3);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    });

});

const mockComponent4 = {
    words: [
        { text: "A", checked: true },
        { text: "B", checked: true },
        { text: "C", checked: true },
        { text: "C", checked: false },
    ]
} as IPlayWordComponent;

describe("line highlighting scoring (3 answers from 4 options)", () => {

    it("should mark a correct answer with 7 marks", () => {
        // arrange
        const mockAttempt4 = {
            answer: [0, 1, 2]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent4, mockAttempt4);

        // assert
        expect(result.marks).toStrictEqual(7);
        expect(result.maxMarks).toStrictEqual(7);
        expect(result.correct).toStrictEqual(true);
    });

    it("if 2 correctly chosen, should mark incorrect with 6 marks", () => {
        // arrange
        const mockAttempt4 = {
            answer: [0, 1]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent4, mockAttempt4);

        // assert
        expect(result.marks).toStrictEqual(6);
        expect(result.maxMarks).toStrictEqual(7);
        expect(result.correct).toStrictEqual(false);
    });

});
