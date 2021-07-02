import { Quill as GlobalQuill } from "react-quill";

const Block = GlobalQuill.import("blots/block");

class BlockQuoteBlot extends Block {
	static blotName = "blockquote";
    static className = "bq";
    static tagName = "blockquote";

    static create(value: any) {
        let node = super.create(value);
        if (value.noBreakLines) {
            node.classList.add("no-break");
        }
        return node;
    }

    static formats(domNode: any) {
        return {
            noBreakLines: domNode.classList.contains("no-break"),
        };
    }

    format(name: any, value: any) {
        if (name !== this.statics.blotName || !value) return super.format(name, value);
        if (value.noBreakLines) {
            this.domNode.classList.add("no-break");
        }
    }
}

GlobalQuill.register(BlockQuoteBlot, true);