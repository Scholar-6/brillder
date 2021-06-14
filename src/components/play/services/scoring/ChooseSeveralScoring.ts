import { ComponentAttempt } from "components/play/model";
import { ChooseSeveralAnswer } from "components/play/questionTypes/choose/chooseSeveral/ChooseSeveral";

const markLiveChoices = (component: any, attempt: ComponentAttempt<ChooseSeveralAnswer>) => {
    const choices = component.list;
/*
    let correctCount = 0;
    for (let [index, choice] of choices.entries()) {
        const checked = attempt.answer.findIndex(a => a.shuffleIndex === index) >= 0;
        if (checked===choice.checked){
            correctCount += 1;
        }
    }*/

    for (let [index, choice] of choices.entries()) {
        const checked = attempt.answer.findIndex(a => a.shuffleIndex === index) >= 0;
        if (checked === choice.checked || (checked === false && !choice.checked)) {
            attempt.marks += 1;
        } else {
            attempt.correct = false;
        }
    }
    return attempt;
}

const mark = (component: any, attempt: ComponentAttempt<ChooseSeveralAnswer>) => {
    const markValue = 1;

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


/* idea
total marks is the number of options (already in place)
marks awarded are distributed evenly via correctly selected options
need: length of list of correct choices (correctChoices?) */