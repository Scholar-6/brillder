import { Quill } from "react-quill";
const Keyboard = Quill.import("modules/keyboard");
const Delta = Quill.import("delta");

class QuillKeyboard extends Keyboard {

    constructor(quill: Quill, options: any) {
        options.bindings.tab = {
            key: "Tab",
            handler: () => true,
        };
        super(quill, options);

        this.addBinding({
            key: " ",
            prefix: / -/,
            handler: (range: any, context: any) => {
                if(!quill) return;
                console.log(quill);
                console.log(range);
                quill.deleteText(range.index - 2, 2, "api");
                quill.insertText(range.index - 2, "—", "api");
            }
        });
    }
}
Quill.register("modules/keyboard", QuillKeyboard);

export default QuillKeyboard;