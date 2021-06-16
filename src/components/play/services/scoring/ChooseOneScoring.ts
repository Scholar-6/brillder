import { ChooseOneComponent, ChooseOneAnswer } from "components/play/questionTypes/choose/chooseOne/ChooseOne";
import { ScoreFunction } from "../scoring";

const mark: ScoreFunction<ChooseOneComponent, ChooseOneAnswer> = (component, attempt) => {
    attempt.maxMarks = (component.list.length-1)*2;

    // set attempt.correct to true by answer index.
    attempt.correct = false;
    if(attempt.answer?.shuffleIndex >= 0 && attempt.answer?.shuffleIndex !== -1 && component.list[attempt.answer?.shuffleIndex].checked === true) {
      attempt.correct = true;
    }

    if (attempt.correct) {
        // if the attempt is correct, then add the marks.
        attempt.marks = attempt.maxMarks;

    }

    else {
        attempt.marks = 0;
    }
    
    return attempt;
};

export default mark;