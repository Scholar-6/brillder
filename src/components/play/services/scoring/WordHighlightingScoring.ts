import { IPlayWordComponent } from "components/interfaces/word";
import { ComponentAttempt } from "components/play/model";

const mark = (component: IPlayWordComponent, attempt: ComponentAttempt<any>) => {
    attempt.correct = true;
    attempt.maxMarks = 6; //change to reflect number of options?

    component.words.forEach((word, index) => {
        const isChecked = attempt.answer.indexOf(index) !== -1;
        const shouldBeChecked = word.checked === true;
        if(isChecked !== shouldBeChecked) {
            attempt.correct = false;
        }
    });

    if(attempt.correct) {
        attempt.marks = attempt.maxMarks;
    } else {
        attempt.marks = 0;
    }

    return attempt;
};

export default mark;