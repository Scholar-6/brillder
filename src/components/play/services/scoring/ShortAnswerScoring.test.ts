import mark from './ShortAnswerScoring';

import { ShortAnswerData } from 'components/build/buildQuestions/questionTypes/shortAnswerBuild/interface';
import { ShortAnswerAnswer } from 'components/play/questionTypes/shortAnswer/ShortAnswer';
import { ComponentAttempt } from 'components/play/model';

jest.mock("desmos");

const mockComponent: ShortAnswerData = {
    list: [{ value: "test"}]
};

describe("short answer scoring", () => {

    it("should mark a correct answer with 4 marks", () => {
        //11/4/2020
        // arrange
        const mockAttempt: ComponentAttempt<ShortAnswerAnswer> = {
            answer: ["test"]
        } as ComponentAttempt<ShortAnswerAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(4);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(true);
        
    });

    it("should mark an almost correct (one wrong character) answer with 3 marks", () => {
        //11/4/2020
        // arrange
        const mockAttempt: ComponentAttempt<ShortAnswerAnswer> = {
            answer: ["tast"]
        } as ComponentAttempt<ShortAnswerAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(3);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark a partially correct (two wrong characters out of four) answer with 1 marks", () => {
        //11/4/2020
        // arrange
        const mockAttempt: ComponentAttempt<ShortAnswerAnswer> = {
            answer: ["sast"]
        } as ComponentAttempt<ShortAnswerAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(1);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark a totally incorrect answer with 0 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<ShortAnswerAnswer> = {
            answer: ["incorrect"]
        } as ComponentAttempt<ShortAnswerAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark multiple incorrect answers with 0 marks each", () => {
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
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(16);
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
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });
    
});