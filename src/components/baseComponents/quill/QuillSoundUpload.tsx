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
}

GlobalQuill.register("modules/soundupload", SoundUpload);

