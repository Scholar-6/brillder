import { Quill as GlobalQuill } from "react-quill";

const Block = GlobalQuill.import("blots/block");

class CodeBlockuoteCustom extends Block {
	static blotName = "codeblockcustom";
    static className = "codeblockcustom";
    static tagName = "codeblockcustom";

    static create(value: any) {
        let node = super.create(value);
        return node;
    }
}

GlobalQuill.register(CodeBlockuoteCustom, true);