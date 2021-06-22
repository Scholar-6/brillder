import Quill from "quill";
import { Quill as GlobalQuill } from "react-quill";
import { QuillValidColors } from "./QuillEditor";
const Clipboard = GlobalQuill.import("modules/clipboard");
const Delta = GlobalQuill.import("delta");

class QuillCustomClipboard extends Clipboard {
    _onPasteImage?: (node: any, delta: any) => void;

    get onPasteImage(): typeof QuillCustomClipboard._onPasteImage {
        return this._onPasteImage;
    }

    set onPasteImage(value: typeof QuillCustomClipboard._onPasteImage) {
        this._onPasteImage = value;

        this.removeMatcher("img");
        this.addMatcher("img", (node: any, delta: any) => {
            if(node.className !== "image-play") {
                this.onPasteImage?.(node, delta);
            }
            return new Delta();
        });
    }

    constructor(quill: Quill, options: any) {
        super(quill, options);

        this.addMatcher("img", () => {
            return new Delta();
        });

        this.addMatcher(Node.ELEMENT_NODE, (node: any, delta: any) => {
            const shouldStripColor = !!delta.ops.find((op: any) => op.attributes?.color && !Object.values(QuillValidColors).find(col => col.toLowerCase() === op.attributes?.color?.toLowerCase?.()));
            console.log(delta, shouldStripColor);
            const newDelta = delta.compose(new Delta().retain(delta.length(), { color: shouldStripColor ? false : undefined, background: false }));
            return newDelta;
        });
    }

    removeMatcher(name: string) {
        this.matchers = this.matchers.filter(([selector, matcher]: any) => selector !== name);
    }
}
GlobalQuill.register("modules/clipboard", QuillCustomClipboard);

export default QuillCustomClipboard;