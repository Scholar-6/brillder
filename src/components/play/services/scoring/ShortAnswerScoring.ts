import { ShortAnswerData } from "components/build/buildQuestions/questionTypes/shortAnswerBuild/interface";
import { ShortAnswerAnswer } from "components/play/questionTypes/shortAnswer/ShortAnswer";
import { stripHtml } from "components/build/questionService/ConvertService";
import { ComponentAttempt } from "components/play/model";

const mark = (component: ShortAnswerData, attempt: ComponentAttempt<ShortAnswerAnswer>) => {
    attempt.maxMarks = 6;

    // The maximum number of marks is divided between all answers.
    let markIncrement = attempt.maxMarks / component.list.length;
    attempt.correct = true;
    attempt.marks = 0;

    component.list.forEach((answer, index) => {
        if (attempt.answer[index]) {
            let correctAnswer = stripHtml(answer.value);
            if (stripHtml(attempt.answer[index]) === correctAnswer) {
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

    // Then, if there are no marks, and there are no empty entries, give the student half a mark.
    const emptyAnswer = attempt.answer.indexOf("");
    if (attempt.marks === 0 && emptyAnswer === -1) attempt.marks += 0.5;
    return attempt;
}

export default mark;