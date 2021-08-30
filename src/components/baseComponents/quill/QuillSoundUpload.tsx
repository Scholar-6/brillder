import { fileUrl, uploadFile } from "components/services/uploadFile";
import Quill from "quill";
import Delta from "quill-delta";
import { Quill as GlobalQuill } from "react-quill";
import axios from "axios";

const Embed = GlobalQuill.import('blots/block/embed');

export class AudioBlot extends Embed {
    static create(url: string) {
        let node = super.create();
        node.setAttribute('src', url);
        node.setAttribute('controls', '');
        return node;
    }

    static value(node: any) {
        return node.getAttribute('src');
    }
}
AudioBlot.blotName = 'audio';
AudioBlot.tagName = 'audio';
Quill.register(AudioBlot);

export class CustomSoundBlot extends Embed {
    static blotName = 'customSound';
    static tagName = 'div';
    static className = 'customSound';

    static create(value: any) {
        const node: Element = super.create();
        node.className = node.className + " custom-audio-controls";
        node.setAttribute('data-value', value.url);
        node.setAttribute('data-caption', value.imageCaption);

        const btnContainer = document.createElement("div");
        btnContainer.className = "button-container";

        const svg2 = document.createElement('svg');
        svg2.classList.add('svg');

        const audio = new Audio(value.url);

        console.log('creted ');

        const svg = document.createElement('svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        btnContainer.onclick = (e: any) => {
            console.log('click', e);
            audio.play();
        }

        btnContainer.addEventListener("click", () => {
            console.log('click2');
            audio.play();
        });

        node.addEventListener('click', function (e) {
            console.log('click44');
        });

        const newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon'); //Create a path in SVG's namespace
        newElement.setAttribute("points", "5 3 19 12 5 21 5 3");
        svg.appendChild(newElement);
        svg2.appendChild(svg);
        btnContainer.appendChild(svg2);

        node.appendChild(btnContainer);

        return node;
    }

    static value(node: any) {
        var blot = {} as any;

        blot.url = node.getAttribute('data-value');
        blot.imageSource = node.getAttribute('data-source');
        blot.imageCaption = node.getAttribute('data-caption');
        blot.imageHeight = node.getAttribute('data-height');
        blot.imagePermision = node.getAttribute('data-permission');

        console.log('blot value', blot);

        return blot;
    }
}
CustomSoundBlot.tagName = "div";
GlobalQuill.register(CustomSoundBlot);

const imageUrlRegex = new RegExp(`${process.env.REACT_APP_BACKEND_HOST}/files/(.*)`);

export default class SoundUpload {
    quill: Quill;
    openDialog: (file?: File, data?: any, blot?: CustomSoundBlot, shouldUpdate?: boolean) => void;

    constructor(quill: Quill, options: any) {
        this.quill = quill;
        console.log(234)
        this.openDialog = options.openDialog;
        const toolbar = quill.getModule("toolbar");
        if (toolbar) {
            toolbar.addHandler("sound", this.uploadHandler.bind(this, toolbar.container));
        }

        quill.on("editor-change", () => {
            quill.root.querySelectorAll<HTMLDivElement>("div.customImage.image-play-container2").forEach(el => {
                el.ondblclick = () => {
                    const blot = GlobalQuill.find(el) as CustomSoundBlot;
                    const data = CustomSoundBlot.value(blot.domNode);
                    this.existingImageSelected({ ...data, value: (data.url as string).match(imageUrlRegex)?.[1] }, blot);
                };
            })
        })
    }

    onImagePaste(node: any, delta: Delta) {
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
        if (selection && this.quill.getFormat(selection)["table-cell-line"]) return;
        this.openDialog();
        /*
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
        */
    }

    imageSelected(files: File[]) {
        if (files.length >= 1) {
            this.openDialog(files[0]);
        }
    }

    existingImageSelected(data: any, blot: any) {
        this.openDialog(undefined, data, blot, true);
    }

    /**
     * @returns true if success false if failed
     */
    async uploadImages(url: string, caption: string) {
        const range = this.quill.getSelection(true);

        this.quill.insertEmbed(range.index, 'customSound', {
            url: fileUrl(url),
            imageCaption: caption,
        });
        this.quill.insertEmbed(range.index + 1, 'devider', '');
        return true;
    }

    async updateImage(leaf: any, data: any) {
        if (leaf instanceof CustomSoundBlot) {
            const leafData = CustomSoundBlot.value(leaf.domNode);

            let fileName = null;
            if (data.newSoundFile) {
                const res = await new Promise<any>((resolve, reject) => uploadFile(data.newSoundFile, resolve, reject));
                if (!res) {
                    return false;
                }
                fileName = res.data.fileName;
            }

            const newData = {
                url: fileName ? fileUrl(fileName) : leafData.url,
            };
            leaf.replaceWith("customSound", newData);
        }
    }
}

GlobalQuill.register("modules/soundupload", SoundUpload);

