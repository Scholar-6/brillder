import React from "react";
import { fileUrl, uploadFile } from "components/services/uploadFile";
import { DeltaStatic, RangeStatic } from "quill";
import Delta from "quill-delta";
import { Quill } from "react-quill";
import { ImageAlign } from "components/build/buildQuestions/components/Image/model";

const ImageBlot = Quill.import('formats/image');
export class CustomImageBlot extends ImageBlot {
    static blotName = 'customImage';
    static tagName = 'div';
    static className = 'customImage';

    static create(value: any) {
        const node: Element = super.create();

        node.className = node.className + " image-play-container2" + ((value.imageAlign === ImageAlign.center) ? " center" : "");
        node.setAttribute('data-url', value.url);
        node.setAttribute('data-source', value.imageSource);
        node.setAttribute('data-caption', value.imageCaption);
        node.setAttribute('data-align', value.imageAlign);
        node.setAttribute('data-height', value.imageHeight);
        node.setAttribute('data-permission', value.imagePermission);

        const containerNode = document.createElement("div");
        containerNode.className = "image-play-container";

        const imageNode = document.createElement("img");
        imageNode.className = "image-play";
        imageNode.setAttribute('style', `height: ${value.imageHeight}vh`);
        imageNode.setAttribute('src', value.url);
        containerNode.appendChild(imageNode);

        const captionNode = document.createElement("figcaption");
        captionNode.className = "image-caption";
        captionNode.textContent = value.imageCaption;
        containerNode.appendChild(captionNode);

        node.appendChild(containerNode);

        return node;
    }

    static value(node: any) {
        var blot = {} as any;
        
        blot.url = node.getAttribute('data-url');
        blot.imageSource = node.getAttribute('data-source');
        blot.imageCaption = node.getAttribute('data-caption');
        blot.imageAlign = node.getAttribute('data-align');
        blot.imageHeight = node.getAttribute('data-height');
        blot.imagePermission = node.getAttribute('data-permission');

        return blot;
    }
}
Quill.register(CustomImageBlot);

export default class ImageUpload {
    quill: Quill;
    openDialog: (file: File) => void;

    constructor(quill: Quill, options: any) {
        this.quill = quill;
        this.openDialog = options.openDialog;
        const toolbar = quill.getModule("toolbar");
        toolbar.addHandler("image", this.uploadHandler.bind(this));
    }

    uploadHandler() {
        const toolbar = this.quill.getModule("toolbar");
        let fileInput = toolbar.container.querySelector("input.ql-image[type=file]");
        if (fileInput === null) {
            fileInput = document.createElement("input");
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute("accept", "image/png, image/gif, image/jpeg, image/bmp, image/x-icon");
            fileInput.classList.add("ql-image");
            fileInput.addEventListener("change", () => {
                if (fileInput.files !== null && fileInput.files[0] !== null) {
                    this.imageSelected(Array.from(fileInput.files));
                }
            });
            toolbar.container.appendChild(fileInput);
        }
        fileInput.click();
    }

    imageSelected(files: File[]) {
        if(files.length >= 1) {
            this.openDialog(files[0]);
        }
    }

    async uploadImages(file: File, source: string, caption: string, align: ImageAlign, height: number) {
        const length = this.quill.getLength();
        const range = this.quill.getSelection(true);
        const res = await new Promise<any>((resolve, reject) => uploadFile(file, resolve, reject));
        const fileName = res.data.fileName;

        const update = new Delta()
            .retain(range.index)
            .delete(range.length)
            .insert({ customImage: {
                url: fileUrl(fileName),
                imageSource: source,
                imageCaption: caption,
                imageAlign: align,
                imageHeight: height,
                imagePermission: true,
            } });

        this.quill.updateContents(update as unknown as DeltaStatic, "user");
        this.quill.setSelection(length + 1, 0, "silent");
    }

    // uploadImages(this: {quill: Quill}, range: any, files: File[]) {
    //     console.log(files);
    //     const promises = files.map(file => new Promise((resolve, reject) => {
    //         uploadFile(file, (res: any) => {
    //             const fileName = res.data.fileName;
    //             const url = `${process.env.REACT_APP_BACKEND_HOST}/files/${fileName}`;
    //             resolve(url);
    //         }, reject);
    //     }));

    //     Promise.all(promises).then((urls) => {
    //         const update = urls.reduce(
    //             (delta: Delta, image) => delta.insert({ image }),
    //             new Delta().retain(range.index).delete(range.length)
    //         );
    //         this.quill.updateContents(update as unknown as DeltaStatic, "user");
    //         this.quill.setSelection(
    //             range.index + urls.length,
    //             "silent"
    //         );
    //     });
    // }
}

Quill.register("modules/imageupload", ImageUpload);

