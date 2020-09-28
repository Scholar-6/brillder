import mark from './ShortAnswerScoring';

import { ShortAnswerData } from 'components/build/buildQuestions/questionTypes/shortAnswerBuild/interface';
import ShortAnswer, { ShortAnswerAnswer } from 'components/play/questionTypes/shortAnswer/ShortAnswer';
import { ComponentAttempt } from 'components/play/model';

const mockComponent: ShortAnswerData = {
    list: [{ value: "test" }]
};

describe("short answer scoring", () => {

    it("should mark a correct answer with 6 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<ShortAnswerAnswer> = {
            answer: ["test"]
        } as ComponentAttempt<ShortAnswerAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(6);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark an incorrect answer with 0.5 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<ShortAnswerAnswer> = {
            answer: ["incorrect"]
        } as ComponentAttempt<ShortAnswerAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0.5);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark multiple incorrect answers with 0.5 marks each", () => {
        // arrange
        const mockComponent: ShortAnswerData = {
            list: [
                { value: "test" },
                { value: "test" },
                { value: "test" },
                { value: "test" }
            ]
        };

        const mockAttempt: ComponentAttempt<ShortAnswerAnswer> = {
            answer: ["incorrect", "incorrect", "incorrect", "incorrect"]
        } as ComponentAttempt<ShortAnswerAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(2);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    })

    it("should mark a blank answer with 0 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<ShortAnswerAnswer> = {
            answer: [""]
        } as ComponentAttempt<ShortAnswerAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(6);
        expect(result.correct).toStrictEqual(false);
    });

});