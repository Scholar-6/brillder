import { uploadFile } from "components/services/uploadFile";
import { DeltaStatic } from "quill";
import Delta from "quill-delta";
import { Quill } from "react-quill";

export default class ImageUpload {
    quill: Quill;

    constructor(quill: Quill) {
        this.quill = quill;
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
                    let range = this.quill.getSelection(true);
                    this.uploadImages(range, Array.from(fileInput.files));
                }
            });
            toolbar.container.appendChild(fileInput);
        }
        fileInput.click();
    }

    uploadImages(this: {quill: Quill}, range: any, files: File[]) {
        console.log(files);
        const promises = files.map(file => new Promise((resolve, reject) => {
            uploadFile(file, (res: any) => {
                const fileName = res.data.fileName;
                const url = `${process.env.REACT_APP_BACKEND_HOST}/files/${fileName}`;
                resolve(url);
            }, reject);
        }));

        Promise.all(promises).then((urls) => {
            const update = urls.reduce(
                (delta: Delta, image) => delta.insert({ image }),
                new Delta().retain(range.index).delete(range.length)
            );
            this.quill.updateContents(update as unknown as DeltaStatic, "user");
            this.quill.setSelection(
                range.index + urls.length,
                "silent"
            );
        });
    }
}

Quill.register("modules/imageupload", ImageUpload);

