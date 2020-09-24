import mark from './HorizontalShuffleScoring';

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
        const mockAttempt: ComponentAttempt<number[]> = {
            answer: [0, 1, 2, 3, 4]
        } as ComponentAttempt<number[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(10);
        expect(result.maxMarks).toStrictEqual(10);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark a partially correct answer with 6 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<number[]> = {
            answer: [1, 2, 3, 4, 0]
        } as ComponentAttempt<number[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(6);
        expect(result.maxMarks).toStrictEqual(10);
        expect(result.correct).toStrictEqual(false);
    })

    it("should mark an incorrect answer with 0.5 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<number[]> = {
            answer: [4, 3, 2, 1, 0]
        } as ComponentAttempt<number[]>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0.5);
        expect(result.maxMarks).toStrictEqual(10);
        expect(result.correct).toStrictEqual(false);
    });

});