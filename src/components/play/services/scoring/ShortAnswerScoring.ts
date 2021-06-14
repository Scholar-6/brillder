import { ShortAnswerData } from "components/build/buildQuestions/questionTypes/shortAnswerBuild/interface";
import { ShortAnswerAnswer } from "components/play/questionTypes/shortAnswer/ShortAnswer";
import { stripHtmlExceptSubAndSup as stripHtml } from "components/build/questionService/ConvertService";
import { ComponentAttempt } from "components/play/model";

const mark = (component: ShortAnswerData, attempt: ComponentAttempt<ShortAnswerAnswer>) => {
    attempt.maxMarks = component.list.length;

    // The maximum number of marks is divided between all answers.
    let markIncrement = attempt.maxMarks / component.list.length;
    attempt.correct = true;
    attempt.marks = 0;

    component.list.forEach((answer, index) => {
        if (attempt.answer[index]) {
            const correctAnswer = stripHtml(answer.value);
            const givenAnswer = stripHtml(attempt.answer[index]);
            console.log(`${givenAnswer.toLowerCase()} ${correctAnswer.toLowerCase()}`)
            if (givenAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                // add the correct amount of marks
                attempt.marks += markIncrement;
            } else {
                // the answer is not correct.
                attempt.correct = false;
            }
        } else {
            // the answer is not filled in.
            attempt.correct = false;
        } 
    });

    return attempt;
}

export default mark;