import { ScoreFunction } from "../scoring";
import { ComponentAttempt } from "components/play/model";
import { ChooseSeveralAnswer } from "components/play/questionTypes/chooseSeveral/ChooseSeveral";

const markLiveChoices = (component: any, attempt: ComponentAttempt<ChooseSeveralAnswer>) => {
    const choices = component.list;
    for (let [index, choice] of choices.entries()) {
        const checked = attempt.answer.indexOf(index);
        if (checked >= 0) {
            if (choice.checked) {
                attempt.marks += 2;
            } else {
                attempt.marks += 0.5;
                attempt.correct = false;
            }
        } else {
            if (choice.checked) {
                attempt.marks += 0;
                attempt.correct = false;
            } else {
                attempt.marks += 2;
            }
        }
    }
    return attempt;
}

const mark = (component: any, attempt: ComponentAttempt<ChooseSeveralAnswer>) => {
    const markValue = 2;

    attempt.correct = true;
    attempt.marks = 0;

    attempt.maxMarks = component.list.length * markValue;
    markLiveChoices(component, attempt);

    if (attempt.answer.length === 0) {
        attempt.marks = 0;
    }

    return attempt;
}

export default mark;