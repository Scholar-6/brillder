import { fileUrl } from "components/services/uploadFile";
import Quill from "quill";
import { Quill as GlobalQuill } from "react-quill";

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
export default class SoundUpload {
    quill: Quill;
    openDialog: () => void;

    constructor(quill: Quill, options: any) {
        this.quill = quill;
        this.openDialog = options.openDialog;
        const toolbar = quill.getModule("toolbar");
        if (toolbar) {
            toolbar.addHandler("sound", this.uploadHandler.bind(this, toolbar.container));
        }
    }

    uploadHandler(toolbarNode: any) {
        if (!toolbarNode) return;
        const selection = this.quill.getSelection(false);
        if (selection && this.quill.getFormat(selection)["table-cell-line"]) return;
        this.openDialog();
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
}

GlobalQuill.register("modules/soundupload", SoundUpload);

