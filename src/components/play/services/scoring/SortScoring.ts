import { SortComponent } from "components/play/questionTypes/sort/Sort";
import { ComponentAttempt } from "components/play/model";

const mark = (component: SortComponent, attempt: ComponentAttempt<any>) => {
    let markIncrement = 1;
    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = 0;

    const unsortedCategory = component.categories.length;
    
    Object.keys(attempt.answer).forEach(key => {
        attempt.maxMarks += markIncrement;
        if (attempt.answer[key] === unsortedCategory) {
            attempt.correct = false;
        } else {
            const assignedCategory = component.categories[attempt.answer[key]];
            if(assignedCategory.answers.find(answer => (answer.value ?? answer.valueFile) === key)) {
                attempt.marks += markIncrement;
            } else {
                attempt.marks += 0.25;
                attempt.correct = false;
            }
        }
    });

    return attempt;
}

export default mark;