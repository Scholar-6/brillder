import { ComponentAttempt } from "components/play/model";
import { PairMatchComponent } from "components/play/questionTypes/pairMatch/interface";

const mark = (component: PairMatchComponent, attempt: ComponentAttempt<any>) => {
    let markIncrement = 2;
    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = markIncrement * component.list.length;

    attempt.answer.forEach((answer: any, index: number, array: any[]) => {
        if(answer.index === component.list[index].index) {
            attempt.marks += markIncrement;
        } else {
            attempt.correct = false;
        }
    });

    return attempt;
}

export default mark;

/* i think we can't necessarily only give points
if the user has interacted - for one the random 
output of options maybe be correct, but also 
the user may agree with whatever the system 
outputs initially - unless we explicitly 
tell the user that they must interact with the 
options to score any points, but i don't like
that*/