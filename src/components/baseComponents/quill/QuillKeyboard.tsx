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

        // hyphen to dash
        this.addBinding({
            key: " ",
            prefix: / -$/,
            handler: (range: any, context: any) => {
                if(!quill) return;
                console.log(quill);
                console.log(range);
                quill.deleteText(range.index - 2, 2, "api");
                quill.insertText(range.index - 2, "—", "api");
            }
        });

        // straight quotes to curly quotes: double
        this.addBinding({
            key: " ",
            prefix: /(^| )"(.*?)"$/,
            handler: (range: any, context: { prefix: string }) => {
                const prefixMatch = context.prefix.match(/(^| )"(.*)"$/)!;
                const newText = `${prefixMatch[1]}“${prefixMatch[2]}” `;

                quill.updateContents(new Delta()
                    .retain(range.index - prefixMatch[0].length)
                    .delete(prefixMatch[0].length)
                    .insert(newText));
            }
        });

        // straight quotes to curly quotes: single
        this.addBinding({
            key: " ",
            prefix: /(^| )'(.*?)'$/,
            handler: (range: any, context: { prefix: string }) => {
                const prefixMatch = context.prefix.match(/(^| )'(.*)'$/)!;
                const newText = `${prefixMatch[1]}‘${prefixMatch[2]}’ `;

                quill.updateContents(new Delta()
                    .retain(range.index - prefixMatch[0].length)
                    .delete(prefixMatch[0].length)
                    .insert(newText));
            }
        });
    }
}
Quill.register("modules/keyboard", QuillKeyboard);

export default QuillKeyboard;