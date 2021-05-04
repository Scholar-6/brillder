import { Quill } from "react-quill";

const Inline = Quill.import("blots/inline");
const Text = Quill.import("blots/text");
const Cursor = Quill.import("blots/cursor");

class LatexBlot extends Inline {
    static formats(): boolean {
        return true;
    }

    formatAt(index: number, length: number, name: string, value: any): void {
        console.log(index, length, name, value);
        if(name === "latex") {
            return super.formatAt(index, length, name, value);
        }
    }
}
LatexBlot.blotName = "latex";
LatexBlot.className = "latex";
LatexBlot.tagName = "SPAN";

Quill.register(LatexBlot, true);

Inline.order.push("latex");
