import mark from './ShuffleScoring';

import { HorizontalShuffleComponent } from '../../questionTypes/horizontalShuffle/HorizontalShuffle';
import { ComponentAttempt } from 'components/play/model';

const mockComponent: HorizontalShuffleComponent = {
    type: 127,
    list: [
        { value: "A", index: 0 },
        { value: "B", index: 1 },
        { value: "C", index: 2 },
        { value: "D", index: 3 },
        { value: "E", index: 4 },
    ]
};

describe("horizontal shuffle scoring", () => {

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

    it("should mark a partially correct answer with 3 marks (for left adjacency)", () => {
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

    it("should mark a partially correct answer with 5 marks (for correct positions and left adjacency)", () => {
        // arrange
        const mockAttempt: ComponentAttempt<{ index: number }[]> = {
            answer: [
                { index: 0 },
                { index: 1 },
                { index: 2 },
                { index: 4 },
                { index: 3 },
            ]
        } as ComponentAttempt<{ index: number }[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(5);
        expect(result.maxMarks).toStrictEqual(9);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark an incorrect answer with 0 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<{ index: number }[]> = {
            answer: [
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
