import { DeltaInsertOp, QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Op from "quill-delta/dist/Op";

const quillToHTML = (data: Op[]) => {
    const converter = new QuillDeltaToHtmlConverter(data, {
        customCssClasses: (op: DeltaInsertOp) => {
            if(op.attributes.latex === true) {
                return "latex";
            }
        }
    });

    // converter.renderCustomWith((customOp, contextOp) => {
    //     console.log(customOp);
    //     if(customOp.attributes.latex === true) {
    //         const val = customOp.insert.value;
    //         return `<span className="latex">${val.text}</span>`;
    //     } else {
    //         return `Unmanaged custom blot!`;
    //     }
    // });

    const html = converter.convert();

    return html;
}

export default quillToHTML;