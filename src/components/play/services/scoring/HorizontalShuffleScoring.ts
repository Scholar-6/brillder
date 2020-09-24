import { ComponentAttempt } from "components/play/model";
import { HorizontalShuffleComponent } from "components/play/questionTypes/horizontalShuffle/HorizontalShuffle";

const permute = (n: number): [number, number][] => {
    const permutations: [number, number][] = [];
    for(let i = 0; i < n - 1; i++) {
        for(let j = i + 1; j < n; j++) {
            permutations.push([i, j]);
        }
    }
    return permutations;
}

const mark = (component: HorizontalShuffleComponent, attempt: ComponentAttempt<any>) => {
    const n = component.list.length;
    const max = (n * (n - 1)) / 2;

    attempt.maxMarks = max;
    attempt.correct = true;
    attempt.marks = max;

    const permutations = permute(n);
    permutations.forEach(([i, j]) => {
        if(attempt.answer[i] > attempt.answer[j]) {
            attempt.marks -= 1;
            attempt.correct = false;
        }
    })
/*
    attempt.answer.forEach((answer: any, index: number, array: any[]) => {
        if (index !== 0) {
        attempt.maxMarks += 5;
        if(answer.index - array[index-1].index === 1) {
            if(!isReview) {
            attempt.marks += markIncrement;
            } else if (prev.answer[index] - prev.answer[index-1] !== 1) {
            attempt.marks += markIncrement;
            }
        } else {
            attempt.correct = false;
        }
        }
    })
*/
    if(attempt.marks === 0 && !attempt.dragged) attempt.marks = 0.5;

    return attempt;
}

export default mark;