import Quill from "quill";
import { Quill as GlobalQuill } from "react-quill";
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
    }

    removeMatcher(name: string) {
        this.matchers = this.matchers.filter(([selector, matcher]: any) => selector !== name);
    }
}
GlobalQuill.register("modules/clipboard", QuillCustomClipboard);

export default QuillCustomClipboard;