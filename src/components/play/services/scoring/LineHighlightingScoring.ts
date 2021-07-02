import { ComponentAttempt } from "components/play/model";

const mark = (component: any, attempt: ComponentAttempt<any>) => {
    attempt.correct = true;
    attempt.maxMarks = 0;
    attempt.marks = 0;

    component.lines.forEach((line: any, index: number) => {
        const isChecked = attempt.answer.indexOf(index) !== -1;
        const shouldBeChecked = line.checked === true;
        if(isChecked) {
            if(shouldBeChecked){
                attempt.marks += 3;
                attempt.maxMarks += 3;
            }
            else{
                attempt.marks -= 2;
                attempt.correct = false;
            }
        }
        else{
            if(shouldBeChecked){
                attempt.maxMarks += 3;
                attempt.correct = false;
            }
        }
    });

    if(attempt.marks<0){
        attempt.marks = 0;
    };

    return attempt;
};

export default mark;