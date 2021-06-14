import { ComponentAttempt } from "components/play/model";

const mark = (component: any, attempt: ComponentAttempt<any>) => {
    const markIncrement = 2; //change to be proportional with number of options?

    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = component.choices.length * markIncrement;
    
    attempt.answer.forEach((choice: any, index: number) => {
        if(component.choices[index].answers[choice.value]) {
            if (component.choices[index].answers[choice.value].checked === true) {
                attempt.marks += markIncrement;
            } else {
                attempt.correct = false;
            }
        } else {
            attempt.correct = false;
        }
    });

    return attempt;
};

export default mark;