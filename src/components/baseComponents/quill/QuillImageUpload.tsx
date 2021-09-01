import { fileUrl, uploadFile } from "components/services/uploadFile";
import Quill from "quill";
import Delta from "quill-delta";
import { Quill as GlobalQuill } from "react-quill";
import { ImageAlign } from "components/build/buildQuestions/components/Image/model";
import axios from "axios";

//const ImageBlot = GlobalQuill.import('formats/image');
const Embed = GlobalQuill.import('blots/block/embed');

class Devider extends Embed {
    static create() {
        let node = super.create();
        node.textContent = 'Invinsible line (devide images)';
        return node;
    }
}
Devider.blotName = 'devider';
Devider.tagName = 'div';
Devider.className = 'invinsible';

GlobalQuill.register(Devider);

class Newline extends Embed {
    static create(value: string) {
        let node = super.create(value);
        return node;
    }
}
Newline.blotName = 'newlinecustom';
Newline.tagName = 'p';
Newline.className = 'new-line-custom';

GlobalQuill.register(Newline);

export class CustomImageBlot extends Embed {
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

        const imageContainer = document.createElement("div");
        imageContainer.className = "il-image-container";
        containerNode.appendChild(imageContainer);

        const imageContainer2 = document.createElement("div");
        imageContainer2.className = "ili-image-container";
        imageContainer.appendChild(imageContainer2);

        const imageNode = document.createElement("img");
        imageNode.className = "image-play";
        imageNode.setAttribute('style', `max-height: ${value.imageHeight}vh`);
        imageNode.setAttribute('src', value.url);
        imageContainer2.appendChild(imageNode);

        const containerSource = document.createElement("div");
        containerSource.className = "image-source-container";
        imageContainer2.appendChild(containerSource);

        const source = document.createElement("div");
        source.textContent = value.imageSource;
        source.className = "image-source";
        containerSource.appendChild(source);

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
CustomImageBlot.tagName="div";
GlobalQuill.register(CustomImageBlot);

const imageUrlRegex = new RegExp(`${process.env.REACT_APP_BACKEND_HOST}/files/(.*)`);

export default class ImageUpload {
    quill: Quill;
    openDialog: (file?: File, data?: any, blot?: CustomImageBlot, shouldUpdate?: boolean) => void;

    constructor(quill: Quill, options: any) {
        this.quill = quill;
        this.openDialog = options.openDialog;
        const toolbar = quill.getModule("toolbar");
        if (toolbar) {
            toolbar.addHandler("image", this.uploadHandler.bind(this, toolbar.container));
        }

        quill.on("editor-change", () => {
            quill.root.querySelectorAll<HTMLDivElement>("div.customImage.image-play-container2").forEach(el => {
                el.ondblclick = () => {
                    const blot = GlobalQuill.find(el) as CustomImageBlot;
                    const data = CustomImageBlot.value(blot.domNode);
                    this.existingImageSelected({ ...data, value: (data.url as string).match(imageUrlRegex)?.[1] }, blot);
                };
            })
        })

        // quill.on("selection-change", (range, oldRange) => {
        //     if (!range) return;
        //     const [leaf] = quill.getLeaf(range.index);
        //     if (leaf instanceof CustomImageBlot) {
        //         leaf.domNode.ondblclick = () => {
        //             const data = CustomImageBlot.value(leaf.domNode);
        //             this.existingImageSelected({ ...data, value: (data.url as string).match(imageUrlRegex)?.[1] });
        //         }
        //     }

        //     if (!oldRange) return;
        //     const [oldLeaf] = quill.getLeaf(oldRange.index);
        //     if (oldLeaf instanceof CustomImageBlot) {
        //         leaf.domNode.onclick = null;
        //     }
        // });
    }

    onImagePaste(node: any, delta: Delta) {
        console.log("h");
        console.log(node);
        if (!node.src) return;
        axios.get(node.src, { responseType: "blob" }).then((response) => {
            const file = new File([response.data as Blob], "imageFile");
            this.imageSelected([file]);
        });
        return new Delta();
    }

    uploadHandler(toolbarNode: any) {
        if (!toolbarNode) return;
        const selection = this.quill.getSelection(false);
        if(selection && this.quill.getFormat(selection)["table-cell-line"]) return;
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
        if (files.length >= 1) {
            console.log(this.openDialog);
            this.openDialog(files[0]);
        }
    }

    existingImageSelected(data: any, blot: any) {
        this.openDialog(undefined, data, blot, true);
    }

    /**
     * @returns true if success false if failed
     */
    async uploadImages(selection: number, file: File, source: string, caption: string, align: ImageAlign, height: number) {
        const res = await new Promise<any>((resolve, reject) => uploadFile(file, resolve, reject));
        if (!res) {
          return false;
        }
        const fileName = res.data.fileName;

        this.quill.insertEmbed(selection, 'customImage', {
            url: fileUrl(fileName),
            imageSource: source,
            imageCaption: caption,
            imageAlign: align,
            imageHeight: height,
            imagePermision: true,
        });
        this.quill.insertEmbed(selection + 1, 'devider', '');
        return true;
    }

    async updateImage(leaf: any, data: any) {
        if (leaf instanceof CustomImageBlot) {
            const leafData = CustomImageBlot.value(leaf.domNode);

            let fileName = null;
            if(data.newImageFile) {
                const res = await new Promise<any>((resolve, reject) => uploadFile(data.newImageFile, resolve, reject));
                if(!res) {
                    return false;
                }
                fileName = res.data.fileName;
            }

            const newData = {
                url: fileName ? fileUrl(fileName) : leafData.url,
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

GlobalQuill.register("modules/imageupload", ImageUpload);

