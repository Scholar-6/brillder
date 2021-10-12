import { ComponentAttempt } from "components/play/model";
import { ChooseSeveralComponent, ChooseSeveralAnswer } from "components/play/questionTypes/choose/chooseSeveral/ChooseSeveral";

const mark = (component: ChooseSeveralComponent, attempt: ComponentAttempt<ChooseSeveralAnswer>) => {
    // See examples of choices and attempt in comment below
    const choices: Array<any> = component.list;
    //console.log(`choices ${Object.entries(choices[0])}`);
    //console.log(`attempt ${Object.entries(attempt)}`);
    // max marks is 2 x the number of correct options 
    attempt.maxMarks = choices.filter((choice) => choice.checked === true).length * 2;

    const whatTheAnswersShouldBe: number[] = choices.reduce((a, e, i) => { if (e.checked) a.push(e.index); return a; }, []);
    //console.log(`whatTheAnswersShouldBe ${whatTheAnswersShouldBe}`);
    const whatTheUserSelected = attempt.answer.map(a => a.realIndex);
    //console.log(`whatTheUserSelected ${whatTheUserSelected}`);
    const correctUserAnswers: number[] = whatTheUserSelected.filter(a => whatTheAnswersShouldBe.includes(a));
    //console.log(`correctUserAnswers ${correctUserAnswers}`);
    const whatTheAnswersShouldNotBe = choices.reduce((a, e, i) => { if (!e.checked) a.push(e.index); return a; }, []);
    const incorrectUserAnswers = whatTheUserSelected.filter(a => whatTheAnswersShouldNotBe.includes(a)).length;

    // 2 points for every correct answer, subtract 1 for every incorrect choice
    attempt.marks = (correctUserAnswers.length * 2) - incorrectUserAnswers;
    // minimum mark is 0
    attempt.marks = attempt.marks < 0 ? 0 : attempt.marks;

    // If there are more possible correct answers then correct user answers then the attempt is incorrect
    attempt.correct = JSON.stringify(whatTheAnswersShouldBe.sort((a, b) => a - b)) === JSON.stringify(correctUserAnswers.sort((a, b) => a - b));

    //#3889
    for (let [i, choice] of (component.list as any).entries()) {
        if (choice.checked === false) {
            for (let answer of attempt.answer) {
                if (i === answer.realIndex) {
                    // check if user selected this answer
                    const answerSelected = whatTheUserSelected.find(selected => selected === answer.realIndex);
                    if (answerSelected && answerSelected >= 0) {
                        attempt.correct = false;
                    }
                }
            }
        }
    }

    return attempt;
}

/*e.g. choices = [
    {"id":816243701,
    "value":"<p>One</p>",
    "checked":true,
    "valueFile":"",
    "soundFile":"",
    "answerType":1,
    "index": 1},
    {"id":816243701,
    "value":"<p>Two</p>",
    "checked":true,
    "valueFile":"",
    "soundFile":"",
    "answerType":1
    "index": 2},
    {"id":816243701,
    "value":"<p>Three</p>",
    "checked":false,
    "valueFile":"",
    "soundFile":"",
    "answerType":1
    "index": 3},
]*/
/* e.g. attempt = {
    answer: [{realIndex: 2, shuffleIndex: 0},{realIndex: 0, shuffleIndex:1}]
    attempted: true
    correct: false
    marks: 0
    maxMarks: 4
    questionId: 236538
} */

export default mark;
