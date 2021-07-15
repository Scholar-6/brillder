import mark from './ShuffleScoring';

import { VerticalShuffleComponent } from '../../questionTypes/vericalShuffle/VerticalShuffle';
import { ComponentAttempt } from 'components/play/model';

const mockComponent: VerticalShuffleComponent = {
    type: 127,
    list: [
        { value: "A", index: 0, valueFile: "" },
        { value: "B", index: 1, valueFile: "" },
        { value: "C", index: 2, valueFile: "" },
        { value: "D", index: 3, valueFile: "" },
        { value: "E", index: 4, valueFile: "" },
    ]
};

describe("vertical shuffle scoring", () => {

    it("should mark a correct answer with 9 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<{ index: number }[]> = {
            answer: [
                { index: 0 },
                { index: 1 },
                { index: 2 },
                { index: 3 },
                { index: 4 },
            ]
        } as ComponentAttempt<{ index: number }[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(9);
        expect(result.maxMarks).toStrictEqual(9);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark a partially correct answer with 3 marks (for upward adjacency)", () => {
        // arrange
        const mockAttempt: ComponentAttempt<{ index: number }[]> = {
            answer: [
                { index: 1 },
                { index: 2 },
                { index: 3 },
                { index: 4 },
                { index: 0 },
            ]
        } as ComponentAttempt<{ index: number }[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(3);
        expect(result.maxMarks).toStrictEqual(9);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark a partially correct answer with 4 marks (for correct positions and upward adjacency)", () => {
        // arrange
        const mockAttempt: ComponentAttempt<{ index: number }[]> = {
            answer: [
                { index: 0 },
                { index: 1 },
                { index: 3 },
                { index: 2 },
                { index: 4 },
            ]
        } as ComponentAttempt<{ index: number }[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(4);
        expect(result.maxMarks).toStrictEqual(9);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark a totally incorrect answer with 0 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<{ index: number }[]> = {
            answer: [
                //no answer is in the right place nor are there any correct consecutive answers
                { index: 4 },
                { index: 3 },
                { index: 0 },
                { index: 2 },
                { index: 1 },
            ],
            dragged: true
        } as ComponentAttempt<{ index: number }[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(9);
        expect(result.correct).toStrictEqual(false);
    });

});