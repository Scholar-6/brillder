import { ChooseOneComponent, ChooseOneAnswer } from "components/play/questionTypes/chooseOne/ChooseOne";
import { ScoreFunction } from "../scoring";

const mark: ScoreFunction<ChooseOneComponent, ChooseOneAnswer> = (component, attempt) => {
    attempt.maxMarks = 6;

    // set attempt.correct to true by answer index.
    attempt.correct = false;
    if(attempt.answer && component.list[attempt.answer].checked === true) {
      attempt.correct = true;
    }

    if (attempt.correct) {
        // if the attempt is correct, then add the marks.
        attempt.marks = attempt.maxMarks;
    } else if (attempt.answer !== null && attempt.answer !== -1) {
        // if there is an answer given, give the student an extra half a mark.
        attempt.marks = 0.5;
    } else {
        attempt.marks = 0;
    }
    
    return attempt;
};

export default mark;