import Quill from "quill";
import { Quill as GlobalQuill } from "react-quill";
const Clipboard = GlobalQuill.import("modules/clipboard");
const Delta = GlobalQuill.import("delta");

class QuillCustomClipboard extends Clipboard {
    _onPasteImage?: (node: any, delta: any) => void;

    /* 5/19/2021 #3347 copy pasting plain text
    onPaste (range:any, b: any) {
       const text = b.text;
       const delta = new Delta()
       .retain(range.index)
       .delete(range.length)
       .insert(text);
       const index = text.length + range.index
       const length = 0
       this.quill.updateContents(delta, 'silent')
       this.quill.setSelection(index, length, 'silent')
       this.quill.scrollIntoView()
    }*/

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

        this.addMatcher("span", (node: any, delta: any) => {
            const newDelta = delta.compose(new Delta().retain(delta.length(), { color: null, background: null }));
            console.log(delta, newDelta);
            return newDelta;
        })
    }

    removeMatcher(name: string) {
        this.matchers = this.matchers.filter(([selector, matcher]: any) => selector !== name);
    }
}
GlobalQuill.register("modules/clipboard", QuillCustomClipboard);

export default QuillCustomClipboard;