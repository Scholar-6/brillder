import { fileUrl, uploadFile } from "components/services/uploadFile";
import { DeltaStatic } from "quill";
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
        node.setAttribute('data-value', value.url);
        node.setAttribute('data-source', value.imageSource);
        node.setAttribute('data-caption', value.imageCaption);
        node.setAttribute('data-align', value.imageAlign);
        node.setAttribute('data-height', value.imageHeight);
        node.setAttribute('data-permission', value.imagePermision);

        const containerNode = document.createElement("div");
        containerNode.className = "image-play-container";
        containerNode.contentEditable = "false";

        const imageNode = document.createElement("img");
        imageNode.className = "image-play";
        imageNode.setAttribute('style', `height: ${value.imageHeight}vh`);
        imageNode.setAttribute('src', value.url);
        containerNode.appendChild(imageNode);

        const captionNode = document.createElement("figcaption");
        captionNode.className = "image-caption";
        captionNode.textContent = value.imageCaption;
        captionNode.contentEditable = "false";
        containerNode.appendChild(captionNode);

        node.appendChild(containerNode);

        return node;
    }

    static value(node: any) {
        var blot = {} as any;
        
        blot.url = node.getAttribute('data-value');
        blot.imageSource = node.getAttribute('data-source');
        blot.imageCaption = node.getAttribute('data-caption');
        blot.imageAlign = parseInt(node.getAttribute('data-align'), 10);
        blot.imageHeight = node.getAttribute('data-height');
        blot.imagePermision = node.getAttribute('data-permission');

        return blot;
    }
}
Quill.register(CustomImageBlot);

const imageUrlRegex = new RegExp(`${process.env.REACT_APP_BACKEND_HOST}/files/(.*)`);

export default class ImageUpload {
    quill: Quill;
    openDialog: (file?: File, data?: any) => void;

    constructor(quill: Quill, options: any) {
        this.quill = quill;
        this.openDialog = options.openDialog;
        const toolbar = quill.getModule("toolbar");
        if(toolbar) {
            toolbar.addHandler("image", this.uploadHandler.bind(this, toolbar.container));
        }

        quill.on("selection-change", (range, oldRange) => {
            if(!range) return;
            const [leaf] = quill.getLeaf(range.index);
            if(leaf instanceof CustomImageBlot) {
                leaf.domNode.ondblclick = () => {
                    const data = CustomImageBlot.value(leaf.domNode);
                    this.existingImageSelected({ ...data, value: (data.url as string).match(imageUrlRegex)?.[1] });
                }
            }

            if(!oldRange) return;
            const [oldLeaf, oldOffset] = quill.getLeaf(oldRange.index);
            if(oldLeaf instanceof CustomImageBlot) {
                leaf.domNode.onclick = null;
            }
        })
    }

    uploadHandler(toolbarNode: any) {
        if(!toolbarNode) return;
        let fileInput = toolbarNode.querySelector("input.ql-image[type=file]");
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
            toolbarNode.appendChild(fileInput);
        }
        fileInput.click();
    }

    imageSelected(files: File[]) {
        if(files.length >= 1) {
            this.openDialog(files[0]);
        }
    }

    existingImageSelected(data: any) {
        this.openDialog(undefined, data);
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
                imagePermision: true,
            } });

        this.quill.updateContents(update as unknown as DeltaStatic, "user");
        this.quill.setSelection(length + 1, 0, "silent");
    }

    async updateImage(data: any) {
        const range = this.quill.getSelection(true);
        const [leaf] = this.quill.getLeaf(range.index);
        if(leaf instanceof CustomImageBlot) {
            const leafData = CustomImageBlot.value(leaf.domNode);
            const newData = {
                url: data.value ? fileUrl(data.value) : leafData.url,
                imageSource: data.source ?? leafData.imageSource,
                imageCaption: data.caption ?? leafData.imageCaption,
                imageAlign: data.align ?? leafData.imageAlign,
                imageHeight: data.height ?? leafData.imageHeight,
                imagePermision: data.permission ?? leafData.imagePermision,
            };
            console.log(newData);
            const newLeaf = leaf.replaceWith("customImage", newData);
            console.log(newLeaf);
        }
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

