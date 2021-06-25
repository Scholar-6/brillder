import { ComponentAttempt } from "components/play/model";
import { ChooseSeveralComponent, ChooseSeveralAnswer } from "components/play/questionTypes/choose/chooseSeveral/ChooseSeveral";

const mark = (component: ChooseSeveralComponent, attempt: ComponentAttempt<ChooseSeveralAnswer>) => {
    const choices: Array<any> = component.list;
    // If max marks is 2 x the number of correct options 
    attempt.maxMarks = choices.filter((choice) => choice.checked === true).length * 2;
    // If max marks is 2 x the total options
    //attempt.maxMarks = choices.length * 2;

    const whatTheAnswersShouldBe = choices.reduce((a, e, i) => { if(e.checked) a.push(i); return a;}, []);
    //console.log(`whatTheAnswersShouldBe ${whatTheAnswersShouldBe}`);
    const whatTheUserSelected = attempt.answer.map(a => a.realIndex);
    //console.log(`whatTheUserSelected ${whatTheUserSelected}`);
    const correctUserAnswers = whatTheUserSelected.filter(a => whatTheAnswersShouldBe.includes(a));
    //console.log(`correctUserAnswers ${correctUserAnswers}`);
    const howManyThingsTheUserMissed = whatTheAnswersShouldBe.filter((a: number) => !whatTheUserSelected.includes(a)).length;
    //console.log(`howManyThingsTheUserMissed ${howManyThingsTheUserMissed}`);

    // 2 points for every correct answer, subtract 1 for every missed answer
    attempt.marks = (correctUserAnswers.length * 2) - howManyThingsTheUserMissed;
    // minimum mark is 0
    attempt.marks = attempt.marks < 0 ? 0 : attempt.marks;

    // If there are more possible correct answers then correct user answers then the attempt is incorrect
    attempt.correct = !(whatTheAnswersShouldBe.length > correctUserAnswers.length);

    return attempt;
}

/*e.g. component.list = [
    {"id":816243701,
    "value":"<p>One</p>",
    "checked":true,
    "valueFile":"",
    "soundFile":"",
    "answerType":1},
    {"id":816243701,
    "value":"<p>Two</p>",
    "checked":true,
    "valueFile":"",
    "soundFile":"",
    "answerType":1},
    {"id":816243701,
    "value":"<p>Three</p>",
    "checked":false,
    "valueFile":"",
    "soundFile":"",
    "answerType":1},
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
