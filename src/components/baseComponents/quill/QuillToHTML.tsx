//import { ImageAlign } from "components/build/buildQuestions/components/Image/model";
import Quill, { DeltaStatic } from "quill";
//import { DeltaInsertOp, QuillDeltaToHtmlConverter } from "quill-delta-to-html";
//import Op from "quill-delta/dist/Op";
import { Quill as GlobalQuill } from "react-quill";

/*
const quillToHTML = (data: Op[]) => {
    const converter = new QuillDeltaToHtmlConverter(data, {
        customTag: (format: string, op: DeltaInsertOp) => {
            if(format === "latex") {
                return `span class="latex"`;
            } else {
            }
        }
    });
    converter.renderCustomWith((customOp, contextOp) => {
        if (customOp.insert.type === "customImage") {
            const value = customOp.insert.value;
            const tag = (
                `<div
                    class="customImage image-play-container2${(value.imageAlign === ImageAlign.center) ? " center" : ""}"
                    data-url="${value.url}"
                    data-source="${value.imageSource}"
                    data-caption="${value.imageCaption}"
                    data-align="${value.imageAlign}"
                    data-height="${value.imageHeight}"
                    data-permission="${value.imagePermission}"
                >
                    <div class="image-play-container">
                        <img class="image-play" style="height: ${value.imageHeight}vh" src="${process.env.REACT_APP_BACKEND_HOST}/files/${value.url}" />
                        <figcaption class="image-caption">${value.imageCaption}</figcaption>
                    </div>
                </div>`
            );
            console.log(tag);
            return tag;
        } else {
            return "Unmanaged custom blot!";
        }
    })

    const html = converter.convert();
    return html;
}
*/

let vQuill: Quill;
const getQuill = () => {
    if(!vQuill) {
        vQuill = new GlobalQuill(document.createElement("div"));
    }
    return vQuill;
}

const deltaCache = new Map();

const quillToHTMLVirtual = (delta: DeltaStatic) => {
    const deltaString = JSON.stringify(delta);
    if(deltaCache.has(deltaString)) {
        return deltaCache.get(deltaString);
    } else {
        const tempQuill = getQuill();
        tempQuill.setContents(delta);
        const html = tempQuill.root.innerHTML;
        deltaCache.set(deltaString, html);
        return html;
    }
}

export default quillToHTMLVirtual;