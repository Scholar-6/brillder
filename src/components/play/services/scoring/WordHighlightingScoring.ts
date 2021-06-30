import { IPlayWordComponent } from "components/interfaces/word";
import { ComponentAttempt } from "components/play/model";

const mark = (component: IPlayWordComponent, attempt: ComponentAttempt<any>) => {
    attempt.correct = true;
    attempt.maxMarks = 6;
    attempt.marks = 0;
    let correctCounter = 0;
    let maxCounter  = 0;

    component.words.forEach((word, index) => {
        const isChecked = attempt.answer.indexOf(index) !== -1;
        const shouldBeChecked = word.checked === true;
    
        if(isChecked){
            if(shouldBeChecked){
                correctCounter += 1;
                maxCounter += 1;
            }
            else{
                attempt.marks -= 1;
                attempt.correct = false;
            }
        }
        else{
            if(shouldBeChecked){
                attempt.correct = false;
                maxCounter += 1;
            }
        }
    });

    //calculate marks

    /*the scoring works such that generally, there are 3 marks available for the
    first two correctly highlighted words, then 1 mark each thereafter. the exception
    is if there is only one word to highlight, in which case there are 4 marks available
    for that correct highlight */
    if (correctCounter === 1){
        if(maxCounter === 1){
            attempt.marks += 4
        }
        else{
            attempt.marks += 3;
        }
    }
    else if(correctCounter === 2){
        attempt.marks += 6;
    }
    else if(correctCounter > 2){
        attempt.marks += 4 + correctCounter;
    }

    //calculate maximum marks
    if (maxCounter === 1){
        attempt.maxMarks = 4;
    }
    else if(maxCounter === 2){
        attempt.maxMarks = 6;
    }
    else{
        attempt.maxMarks = 4 + maxCounter;
    }

    //sets marks to 0 if calculated to be negative
    if(attempt.marks<0){
        attempt.marks = 0;
    }

    return attempt;
};

export default mark;