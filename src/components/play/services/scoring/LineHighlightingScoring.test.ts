import mark from './LineHighlightingScoring';

import { ComponentAttempt } from 'components/play/model';

const mockComponent = {
    lines: [
        { text: "Line 1", checked: true },
        { text: "Line 2", checked: false },
    ]
}

describe("line highlighting scoring (1 answer from 2 options)", () => {

    it("should mark a correct answer with 3 marks", () => {
        // arrange
        const mockAttempt = {
            answer: [0]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(3);
        expect(result.maxMarks).toStrictEqual(3);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark an incorrect answer with 0 marks", () => {
        // arrange
        const mockAttempt = {
            answer: [1]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(3);
        expect(result.correct).toStrictEqual(false);
    });

    it("if both selected, should mark as incorrect with 1 mark", () => {
        // arrange
        const mockAttempt = {
            answer: [0, 1]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(1);
        expect(result.maxMarks).toStrictEqual(3);
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
        expect(result.maxMarks).toStrictEqual(3);
        expect(result.correct).toStrictEqual(false);
    });

});

const mockComponent2 = {
    lines: [
        { text: "Line 1", checked: true },
        { text: "Line 2", checked: false },
        { text: "Line 3", checked: false },
    ]
}

describe("line highlighting scoring (1 answer from 3 options)", () => {

    it("if all selected, should mark as incorrect with 0 marks", () => {
        //the correct answer gives 3 points, but the two incorrect answers deduct
        //2 points each, leaving -1 point, which should get converted to 0 points.

        // arrange
        const mockAttempt2 = {
            answer: [0, 1, 2]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent2, mockAttempt2);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(3);
        expect(result.correct).toStrictEqual(false);
    });
});

const mockComponent3 = {
    lines: [
        { text: "Line 1", checked: true },
        { text: "Line 2", checked: true },
        { text: "Line 3", checked: false },
    ]
}

describe("line highlighting scoring (2 answers from 3 options)", () => {

    it("should mark as correct with 6 marks", () => {
        
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

    it("only 1 correct, should mark as incorrect with 3 marks", () => {
        
        // arrange
        const mockAttempt4 = {
            answer: [0]
        } as ComponentAttempt<any>;

        // act
        const result = mark(mockComponent3, mockAttempt4);

        // assert
        expect(result.marks).toStrictEqual(3);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    });
});