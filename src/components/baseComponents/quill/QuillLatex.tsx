import { Quill as GlobalQuill } from "react-quill";

const Inline = GlobalQuill.import("blots/inline");
const Text = GlobalQuill.import("blots/text");
const Cursor = GlobalQuill.import("blots/cursor");

class LatexBlot extends Inline {
    static formats(): boolean {
        return true;
    }

    formatAt(index: number, length: number, name: string, value: any): void {
        if(name === "latex") {
            return super.formatAt(index, length, name, value);
        }
    }
}
LatexBlot.blotName = "latex";
LatexBlot.className = "latex";
LatexBlot.tagName = "SPAN";

GlobalQuill.register(LatexBlot, true);

Inline.order.push("latex");
