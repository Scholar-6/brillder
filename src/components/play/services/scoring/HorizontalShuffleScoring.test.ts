import mark from './ShuffleScoring';

import { HorizontalShuffleComponent } from '../../questionTypes/horizontalShuffle/HorizontalShuffle';
import { ComponentAttempt } from 'components/play/model';

const mockComponent: HorizontalShuffleComponent = {
    type: 127,
    list: [
        { value: "A" },
        { value: "B" },
        { value: "C" },
        { value: "D" },
        { value: "E" },
    ]
};

describe("horizontal shuffle scoring", () => {

    it("should mark a correct answer with 10 marks", () => {
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
        expect(result.marks).toStrictEqual(10);
        expect(result.maxMarks).toStrictEqual(10);
        expect(result.correct).toStrictEqual(true);
    });

    it("should scale down a score greater than 12 to 12", () => {
        // arrange
        const mockComponent: HorizontalShuffleComponent = {
            type: 127,
            list: [
                { value: "A" },
                { value: "B" },
                { value: "C" },
                { value: "D" },
                { value: "E" },
                { value: "F" },
                { value: "G" },
            ]
        };

        const mockAttempt: ComponentAttempt<{ index: number }[]> = {
            answer: [
                { index: 0 },
                { index: 1 },
                { index: 2 },
                { index: 3 },
                { index: 4 },
                { index: 5 },
                { index: 6 },
            ]
        } as ComponentAttempt<{ index: number }[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(12);
        expect(result.maxMarks).toStrictEqual(12);
        expect(result.correct).toStrictEqual(true);
    })

    it("should mark a partially correct answer with 6 marks", () => {
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
        expect(result.marks).toStrictEqual(6);
        expect(result.maxMarks).toStrictEqual(10);
        expect(result.correct).toStrictEqual(false);
    })

    it("should mark an incorrect answer with 0.5 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<{ index: number }[]> = {
            answer: [
                { index: 4 },
                { index: 3 },
                { index: 2 },
                { index: 1 },
                { index: 0 },
            ],
            dragged: true
        } as ComponentAttempt<{ index: number }[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0.5);
        expect(result.maxMarks).toStrictEqual(10);
        expect(result.correct).toStrictEqual(false);
    });

});