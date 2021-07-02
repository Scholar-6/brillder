import Quill from "quill";
import Delta from "quill-delta";
import { Quill as GlobalQuill } from "react-quill";

export default class QuillCapitalization {
    quill: Quill;

    constructor(quill: Quill) {
        this.quill = quill;
        const toolbar = quill.getModule("toolbar");

        if(toolbar) {
            toolbar.addHandler("caps_upper", () => {
                const { index, length } = this.quill.getSelection()!;
                const text = this.quill.getText(index, length);
                const upperText = text.toUpperCase();
                this.quill.updateContents(
                    new Delta()
                        .retain(index)
                        .delete(length)
                        .insert(upperText),
                    "user"
                );
            });
            toolbar.addHandler("caps_lower", () => {
                const { index, length } = this.quill.getSelection()!;
                const text = this.quill.getText(index, length);
                const upperText = text.toLowerCase();
                this.quill.updateContents(
                    new Delta()
                        .retain(index)
                        .delete(length)
                        .insert(upperText),
                    "user"
                );
            });
            toolbar.addHandler("caps_mixed", () => {
                const { index, length } = this.quill.getSelection()!;
                const text = this.quill.getText(index, length);
                const upperText = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                this.quill.updateContents(
                    new Delta()
                        .retain(index)
                        .delete(length)
                        .insert(upperText),
                    "user"
                );
            });
        }
    }

    format(value?: string) {
        const { index, length } = this.quill.getSelection()!;
        const text = this.quill.getText(index, length);
        let newText = text;
        if (value === "upper") {
            newText = text.toUpperCase();
        } else if (value === "lower") {
            newText = text.toLowerCase();
        } else if (value === "title") {
            newText = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        }
        this.quill.updateContents(
            new Delta()
                .retain(index)
                .delete(length)
                .insert(newText),
            "user"
        );
    }
}

GlobalQuill.register("modules/capitalization", QuillCapitalization);