import { ComponentAttempt } from "components/play/model";
import { ChooseSeveralAnswer } from "components/play/questionTypes/choose/chooseSeveral/ChooseSeveral";

const mark = (component: any, attempt: ComponentAttempt<ChooseSeveralAnswer>) => {
    //const markValue = 1;

    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = 0;

    markLiveChoices(component, attempt);

    /* \\24 June 2021 redundant
    if (attempt.answer.length === 0) {
        attempt.marks = 0;
    }*/

    return attempt;
}


const markLiveChoices = (component: any, attempt: ComponentAttempt<ChooseSeveralAnswer>) => {
    const choices = component.list;

    for (let [index, choice] of choices.entries()) {
        const checked = attempt.answer.findIndex(a => a.shuffleIndex === index) >= 0;
        if (choice.checked){
            attempt.maxMarks += 2;
        }
        //checked is whether the user has selected. 
        //choice.checked is whether it is supposed to be selected
        if (checked && choice.checked) {
            attempt.marks += 2;
        } 
        else if (checked && !choice.checked ){
            attempt.marks -= 1;
            attempt.correct = false;
        }
        else {attempt.correct = false}

        
    }

    if (attempt.marks<0){
        attempt.marks = 0;
    }

    return attempt;
}



export default mark;
