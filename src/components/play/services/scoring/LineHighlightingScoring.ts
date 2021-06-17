import { ComponentAttempt } from "components/play/model";

const mark = (component: any, attempt: ComponentAttempt<any>) => {
    attempt.correct = true;
    attempt.maxMarks = 6;

    component.lines.forEach((line: any, index: number) => {
        const isChecked = attempt.answer.indexOf(index) !== -1;
        const shouldBeChecked = line.checked === true;
        if(isChecked !== shouldBeChecked) {
            attempt.correct = false;
        }
    });

    if (attempt.correct) {
        attempt.marks = attempt.maxMarks;
    } else {
        attempt.marks = 0;

    }

    return attempt;
};

export default mark;