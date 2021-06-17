import { ComponentAttempt } from "components/play/model";
import { PairMatchComponent } from "components/play/questionTypes/pairMatch/interface";

const mark = (component: PairMatchComponent, attempt: ComponentAttempt<any>) => {
    let markIncrement = 1;
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