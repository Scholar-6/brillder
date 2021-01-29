import { DeltaInsertOp, QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Op from "quill-delta/dist/Op";

const quillToHTML = (data: Op[]) => {
    const converter = new QuillDeltaToHtmlConverter(data, {
        customTag: (format: string, op: DeltaInsertOp) => {
            if(format === "latex") {
                return `span class="latex"`;
            }
        }
    });

    const html = converter.convert();
    console.log(data, html);

    return html;
}

export default quillToHTML;