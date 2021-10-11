import { generateId } from "components/build/buildQuestions/questionTypes/service/questionBuild";
import Quill from "quill";
import { Quill as GlobalQuill } from "react-quill";

const Embed = GlobalQuill.import('blots/block/embed');

declare const WaveSurfer: any;
export interface AudioData {
  url: string; // full url
  caption: string;
  source: string;
  permision: any;
}
export class AudioBlot extends Embed {
  static create(data: AudioData) {
    console.log(data);
    let node = super.create();
    node.classList.add('ql-sound-custom');
    node.setAttribute('data-value', data.url);
    node.setAttribute('data-caption', data.caption);
    node.setAttribute('data-source', data.source);

    const wave = document.createElement("div");

    const id = generateId().toString();
    wave.classList.add('quill-wave');
    wave.setAttribute('id', 'wave-' + id);
    node.appendChild(wave);

    setTimeout(() => {
      const addWave = (id: string) => {
        const wavesurfer = WaveSurfer.create({
          container: '#wave-' + id,
          barGap: 4,
          barWidth: 4,
          barHeight: 4,
          barRadius: 4,
          cursorWidth: 0,
          height: 100,
          hideScrollbar: true,
          progressColor: '#c43c30',
          cursorColor: 'red',
          normalize: true,
          responsive: true,
          waveColor: '#001c58',
        });

        wavesurfer.load(data.url);
      }
      try {
        addWave(id);
      } catch {
        setTimeout(() => {
          addWave(id);
        },1500);
      }

    }, 500);

    const audioElement = document.createElement("audio");
    audioElement.setAttribute('src', data.url);
    audioElement.setAttribute('controls', '');
    node.appendChild(audioElement);

    const captionElement = document.createElement("div");
    captionElement.classList.add('sound-caption');
    captionElement.innerHTML = data.caption;
    node.appendChild(captionElement);

    return node;
  }

  static value(node: any) {
    return {
      url: node.getAttribute('data-value'),
      caption: node.getAttribute('data-caption'),
      source: node.getAttribute('data-source')
    }
  }
}
AudioBlot.blotName = 'audio';
AudioBlot.tagName = 'div';
GlobalQuill.register(AudioBlot);

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

