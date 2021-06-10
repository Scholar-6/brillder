import { SortComponent } from "components/play/questionTypes/sort/Sort";
import { ComponentAttempt } from "components/play/model";

const mark = (component: SortComponent, attempt: ComponentAttempt<any>) => {
    let markIncrement = 1;
    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = 0;

    const unsortedCategory = component.categories.length;

    /**
     * @param value category index and answer index in category example: 1_0
     */

    const findCategoryIndex = (value: string) => {
      const keys = value.split('_');
      return parseInt(keys[0]);
    }
    
    Object.keys(attempt.answer).forEach(key => {
        attempt.maxMarks += markIncrement;
        let assignedCategoryIndex = attempt.answer[key];
        if (assignedCategoryIndex === unsortedCategory) {
            attempt.correct = false;
        } else {
            if(assignedCategoryIndex === findCategoryIndex(key)) {
                attempt.marks += markIncrement;
            } else {
                //attempt.marks += 0.25;
                attempt.correct = false;
            }
        }
    });

    return attempt;
}

export default mark;