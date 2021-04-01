import { Quill } from "react-quill";
const Clipboard = Quill.import("modules/clipboard");
const Delta = Quill.import("delta");

class QuillCustomClipboard extends Clipboard {
    _onPasteImage?: (node: any, delta: any) => void;

    get onPasteImage(): typeof QuillCustomClipboard._onPasteImage {
        return this._onPasteImage;
    }

    set onPasteImage(value: typeof QuillCustomClipboard._onPasteImage) {
        this._onPasteImage = value;

        this.removeMatcher("img");
        this.addMatcher("img", (node: any, delta: any) => {
            this.onPasteImage?.(node, delta);
            return new Delta();
        });
        console.log(this.matchers);
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
Quill.register("modules/clipboard", QuillCustomClipboard);

export default QuillCustomClipboard;