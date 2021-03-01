import { Quill } from "react-quill";

const Inline = Quill.import("blots/inline");

class LatexBlot extends Inline {
    static formats(): boolean {
        return true;
    }
}
LatexBlot.blotName = "latex";
LatexBlot.className = "latex";
LatexBlot.tagName = "SPAN";

Quill.register(LatexBlot, true);
