import { Delta } from "quill";
import { Quill } from "react-quill";

const YOUTUBE_REGEXP = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/g;
const EMBED_REGEXP = /https:\/\/www.youtube.com\/embed\/([\w\-\_]*)/;

const BlockEmbed = Quill.import("blots/block/embed");
class YoutubeEmbed extends BlockEmbed {
    static create(value: string) {
        let node = super.create();
        node.setAttribute("width", "560");
        node.setAttribute("height", "315");
        node.setAttribute("frameborder", "0");
        node.setAttribute("allowfullscreen", "true")
        node.setAttribute("src", "https://www.youtube.com/embed/" + value);
        return node;
    }

    static value(node: YoutubeEmbed) {
        const src: string = node.getAttribute("src");
        const id = src.match(EMBED_REGEXP)![1];
        return id;
    }
}
YoutubeEmbed.blotName = 'youtube';
YoutubeEmbed.tagName= 'iframe';
Quill.register(YoutubeEmbed, true);

export default class MediaEmbed {
    constructor(quill: Quill) {
        quill.clipboard.addMatcher(Node.TEXT_NODE, (node: any, delta: Delta) => {
            const matches: string[] = Array.from(node.data.matchAll(YOUTUBE_REGEXP));
            if(matches && matches.length > 0) {
                console.log(matches);
                const ops = [];
                let str: string = node.data;
                for(const match of matches) {
                    const split = str.split(match[0]);
                    const beforeLink = split.shift();
                    ops.push({ insert: beforeLink });
                    ops.push({ insert: "\n" });
                    ops.push({ insert: { youtube: match[1] } });
                    ops.push({ insert: "\n" });
                    str = split.join(match);
                }
                ops.push({ insert: str });
                delta.ops = ops;
            }
            return delta;
        });
    }
}

Quill.register('modules/mediaembed', MediaEmbed);