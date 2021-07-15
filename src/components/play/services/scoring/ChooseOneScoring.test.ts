import mark from './ChooseOneScoring';

import { ChooseOneAnswer, ChooseOneComponent } from 'components/play/questionTypes/choose/chooseOne/ChooseOne';
import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { ComponentAttempt } from 'components/play/model';

const mockComponent: ChooseOneComponent = {
    type: 127,
    list: [
        { value: "A", valueFile: "", checked: false, index: 0, answerType: QuestionValueType.String, soundFile: "", soundCaption: ""},
        { value: "B", valueFile: "", checked: true, index: 1,  answerType: QuestionValueType.String, soundFile: "", soundCaption: ""},
        { value: "C", valueFile: "", checked: false, index: 2, answerType: QuestionValueType.String, soundFile: "", soundCaption: ""}
    ],
}

describe("choose one scoring", () => {
    
    it("should mark a correct answer with 4 marks if 3 options", () => {
        // arrange
        const mockAttempt: ComponentAttempt<ChooseOneAnswer> = {
            answer: {shuffleIndex: 1, realIndex: 1 }
        } as ComponentAttempt<ChooseOneAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(4);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(true);
    });

    it("should mark an incorrect answer with 0 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<ChooseOneAnswer> = {
            answer: { realIndex: 0, shuffleIndex: 0 }
        } as ComponentAttempt<ChooseOneAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

    it("should mark a blank answer with 0 marks", () => {
        // arrange
        const mockAttempt: ComponentAttempt<ChooseOneAnswer> = {
            answer: { realIndex: -1, shuffleIndex: -1 }
        } as ComponentAttempt<ChooseOneAnswer>;

        // act
        const result = mark(mockComponent, mockAttempt);

        // assert
        expect(result.marks).toStrictEqual(0);
        expect(result.maxMarks).toStrictEqual(4);
        expect(result.correct).toStrictEqual(false);
    });

});