import mark from './ShuffleScoring';

import { VerticalShuffleComponent } from '../../questionTypes/vericalShuffle/VerticalShuffle';
import { ComponentAttempt } from 'components/play/model';

const mockComponent: VerticalShuffleComponent = {
    type: 127,
    list: [
        { value: "A", index: 0 },
        { value: "B", index: 1 },
        { value: "C", index: 2 },
        { value: "D", index: 3 },
        { value: "E", index: 4 },
    ]
};

describe("vertical shuffle scoring", () => {

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

    it("should mark an incorrect answer with 0.5 marks if it was dragged", () => {
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

    it("should mark an incorrect answer with 0 marks if it was not dragged", () => {
        // arrange
        const mockAttempt: ComponentAttempt<{ index: number }[]> = {
            answer: [
                { index: 4 },
                { index: 3 },
                { index: 2 },
                { index: 1 },
                { index: 0 },
            ],
            dragged: false
        } as ComponentAttempt<{ index: number }[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(10);
        expect(result.correct).toStrictEqual(false);
    });

});