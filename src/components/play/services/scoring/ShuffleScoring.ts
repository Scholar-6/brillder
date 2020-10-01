import { ComponentAttempt } from "components/play/model";
import { HorizontalShuffleComponent } from "components/play/questionTypes/horizontalShuffle/HorizontalShuffle";
import { VerticalShuffleComponent } from "components/play/questionTypes/vericalShuffle/VerticalShuffle";

const permute = (n: number): [number, number][] => {
    const permutations: [number, number][] = [];
    for(let i = 0; i < n - 1; i++) {
        for(let j = i + 1; j < n; j++) {
            permutations.push([i, j]);
        }
    }
    return permutations;
}

const mark = (component: HorizontalShuffleComponent | VerticalShuffleComponent, attempt: ComponentAttempt<any>) => {
    const n = component.list.length;
    const max = (n * (n - 1)) / 2;

    attempt.maxMarks = max;
    attempt.correct = true;
    attempt.marks = max;

    const permutations = permute(n);
    permutations.forEach(([i, j]) => {
        if(attempt.answer[i].index > attempt.answer[j].index) {
            attempt.marks -= 1;
            attempt.correct = false;
        }
    })

    if(attempt.maxMarks > 12) {
        attempt.marks = Math.ceil(attempt.marks * (12 / attempt.maxMarks));
        attempt.maxMarks = 12;
    }

    if(attempt.marks === 0 && attempt.dragged) attempt.marks = 0.5;
    return attempt;
}

export default mark;