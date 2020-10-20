import { BrickDiff, DoubleBrickDiff } from "./diff";

export default class UndoRedoService {

    private static _instance?: UndoRedoService;

    public static get instance() {
        if(!UndoRedoService._instance) {
            UndoRedoService._instance = new UndoRedoService();
        }
        return UndoRedoService._instance;
    }

    private stack: Array<DoubleBrickDiff> = [];
    private currentPosition: number = -1;

    private constructor() {
        this.clear();
    }

    public clear() {
        this.stack = [];
        this.currentPosition = -1;
    }

    public push(diff: DoubleBrickDiff) {
        console.log("push", diff);
        if(this.currentPosition < this.stack.length - 1) {
            this.stack = this.stack.slice(0, this.currentPosition + 1);
        }
        this.stack.push(diff);
        this.currentPosition++;
    }

    public undo() {
        if(this.currentPosition >= 0) {
            const diff = this.stack[this.currentPosition];
            this.currentPosition--;
            return diff.backward;
        } else {
            return null;
        }
    }

    public redo() {
        if(this.currentPosition < this.stack.length - 1) {
            this.currentPosition++;
            return this.stack[this.currentPosition].forward;
        } else {
            return null;
        }
    }

}