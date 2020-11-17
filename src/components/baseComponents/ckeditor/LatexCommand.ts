// @ts-ignore
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class LatexCommand extends Command {
    editor: any;
    isEnabled: any;

    constructor(editor: any) {
        super(editor);

        this.editor = editor;
    }

    execute() {
        console.log("inserting latex");
        this.editor.model.change((writer: any) => {
            const currentSelection = this.editor.model.document.selection;

            if(currentSelection.rangeCount === 0) {
                return;
            }

            const currentRange = currentSelection.getFirstRange();

            if(!currentRange.isFlat) {
                return;
            }

            if(currentRange.isCollapsed) {
                writer.insertText("% Latex Code", { latex: true }, currentRange.start)
            } else {
                writer.setAttributes({
                    'latex': true
                }, currentRange);
            }
        });
    }

    refresh() {
        this.isEnabled = true;
    }
}

const createLatex = (writer: any) => {
    const latexBox = writer.createElement('latex');
    writer.appendText("% Latex Code", latexBox);
    return latexBox;
}