import { ComponentAttempt } from "components/play/model";
import { HorizontalShuffleComponent } from "components/play/questionTypes/horizontalShuffle/HorizontalShuffle";
import { VerticalShuffleComponent } from "components/play/questionTypes/vericalShuffle/VerticalShuffle";

/*
const permute = (n: number): [number, number][] => {
    const permutations: [number, number][] = [];
    for(let i = 0; i < n - 1; i++) {
        for(let j = i + 1; j < n; j++) {
            permutations.push([i, j]);
        }
    }
    return permutations;
}*/

const mark = (component: HorizontalShuffleComponent | VerticalShuffleComponent, attempt: ComponentAttempt<any>) => {
    const n = component.list.length;
    const max = (2*n)-1;

    attempt.maxMarks = max;
    attempt.correct = true;
    attempt.marks = 0;

    for(let i=0;i<component.list.length;i++){
        if(attempt.answer[i].index===i){
            attempt.marks += 1;
        }
        else{
            attempt.correct = false;
        }
        if(i>0 && attempt.answer[i].index - attempt.answer[i-1].index === 1){
            attempt.marks += 1;
        }
    }
    return attempt;
}

export default mark;