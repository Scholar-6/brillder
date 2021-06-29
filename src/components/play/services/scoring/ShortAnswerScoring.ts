import { ShortAnswerData } from "components/build/buildQuestions/questionTypes/shortAnswerBuild/interface";
import { ShortAnswerAnswer } from "components/play/questionTypes/shortAnswer/ShortAnswer";
import { stripHtmlExceptSubAndSup as stripHtml } from "components/build/questionService/ConvertService";
import { ComponentAttempt } from "components/play/model";
import { endianness } from "os";

const mark = (component: ShortAnswerData, attempt: ComponentAttempt<ShortAnswerAnswer>) => {
    attempt.maxMarks = 0;
    attempt.correct = true;
    attempt.marks = 0;
    
    component.list.forEach((answer, index) => {
        const correctAnswer = stripHtml(answer.value);
        if(correctAnswer.toLowerCase().length<4){
            //2 marks for each of the first 3 symbols
            attempt.maxMarks += 2*correctAnswer.toLowerCase().length;
        }
        else{
            //2 marks for each of the first 3 symbols and 1 for each after
            attempt.maxMarks += 6 + (correctAnswer.toLowerCase().length - 3);
        }

        if (attempt.answer[index]) {
            const givenAnswer = stripHtml(attempt.answer[index]);
            let end = 0;
            console.log(`${givenAnswer.toLowerCase()} ${correctAnswer.toLowerCase()}`)

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
            
            //check each symbol and compare to correct answer. 2 marks for each of first 3, 
            //1 for each of remaining
            for(let i=0; i<end; i++){
                if(givenAnswer.toLowerCase()[i]===correctAnswer.toLowerCase()[i]){
                    if(i<3){
                        attempt.marks += 2;
                    }
                    else{
                        attempt.marks += 1;
                    }
                }
                else{
                    attempt.correct = false;
                }
            }
        } 
        else {
            // the answer is not filled in.
            attempt.correct = false;
        } 
    });

    return attempt;
}

export default mark;