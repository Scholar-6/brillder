import { Quill as GlobalQuill } from "react-quill";

const Block = GlobalQuill.import("blots/block");

class BlockQuoteBlot extends Block {
	static blotName = "blockquote";
    static className = "bq";
    static tagName = "blockquote";

    static create(value: any) {
        let node = super.create(value);
        return node;
    }
}

GlobalQuill.register(BlockQuoteBlot, true);