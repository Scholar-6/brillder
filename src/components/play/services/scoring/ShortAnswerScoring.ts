import { ShortAnswerData } from "components/build/buildQuestions/questionTypes/shortAnswerBuild/interface";
import { ShortAnswerAnswer } from "components/play/questionTypes/shortAnswer/ShortAnswer";
import { ComponentAttempt } from "components/play/model";
import { stripHtml } from "components/build/questionService/ConvertService";

const mark = (component: ShortAnswerData, attempt: ComponentAttempt<ShortAnswerAnswer>) => {
    attempt.maxMarks = 0;
    attempt.correct = true;
    attempt.marks = 0;
    
    component.list.forEach((answer, index) => {
        const correctAnswer = stripHtml(answer.value);
        attempt.maxMarks += correctAnswer.length;

        if (attempt.answer[index]) {
            const givenAnswer = stripHtml(attempt.answer[index]);
            let end = 0;
            let allow_one_mistake = 0;

            //check how far through letters to check
            if(givenAnswer.toLowerCase().length!==correctAnswer.toLowerCase().length){
                attempt.correct = false;
                if(givenAnswer.toLowerCase().length<correctAnswer.toLowerCase().length) {
                    end = givenAnswer.toLowerCase().length
                }
                else {
                    end = correctAnswer.toLowerCase().length
                }
            }
            else {
                end=givenAnswer.toLowerCase().length;
            }
            
            for(let i=0; i<end; i++){
                if(givenAnswer.toLowerCase()[i]===correctAnswer.toLowerCase()[i]){
                    attempt.marks += 1;
                }
                else{
                    /*eslint-disable-next-line*/
                    if (allow_one_mistake == 1){
                        attempt.marks -= 1;
                    }
                    else {allow_one_mistake += 1;}
                }
            }
        } 
        else {
            // the answer is not filled in.
            attempt.correct = false;
        } 
    });

    if(attempt.marks<0){
        attempt.marks = 0;
        attempt.correct = false;
    }
    else if (attempt.marks < attempt.maxMarks){
        attempt.correct = false;
    }
    return attempt;
}

export default mark;