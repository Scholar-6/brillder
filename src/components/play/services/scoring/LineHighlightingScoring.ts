import { ComponentAttempt } from "components/play/model";

const mark = (component: any, attempt: ComponentAttempt<any>) => {
    attempt.correct = true;
    attempt.maxMarks = 0;
    attempt.marks = 0;

    component.lines.forEach((line: any, index: number) => {
        const isChecked = attempt.answer.indexOf(index) !== -1;
        const shouldBeChecked = line.checked === true;
        if(shouldBeChecked){attempt.maxMarks += 3}
        if(isChecked){
        if(shouldBeChecked === false) {
            attempt.correct = false;
            attempt.marks -= 2;
        }
        else {
            attempt.marks += 3;
        }}
    });

    
    if(attempt.marks<0){
        attempt.marks=0;
    }

    return attempt;
};

export default mark;

/* this does what Joe wants but doesn't factor in the
added difficulty of lots of options - maxMarks is 
proportional to the number of correct answers rather 
than to number of options */