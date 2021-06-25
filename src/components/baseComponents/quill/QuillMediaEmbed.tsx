import Quill from "quill";
import Delta from "quill-delta";
import { Quill as GlobalQuill } from "react-quill";

/*eslint-disable-next-line*/
const YOUTUBE_REGEXP = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/g;
/*eslint-disable-next-line*/
const EMBED_REGEXP = /https:\/\/www.youtube.com\/embed\/([\w\-\_]*)/;

const BlockEmbed = GlobalQuill.import("blots/block/embed");
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
YoutubeEmbed.tagName = 'iframe';
GlobalQuill.register(YoutubeEmbed, true);

const TED_REGEXP = /http(?:s?):\/\/www.ted.com\/talks\/([\w\-\_?&=]*)/g;
const TED_EMBED_REGEXP = /https:\/\/embed.ted.com\/talks\/([\w\-\_]*)/;
class TedEmbed extends BlockEmbed {
    static create(value: string) {
        let node = super.create();
        node.setAttribute("width", "560");
        node.setAttribute("height", "315");
        node.setAttribute("frameborder", "0");
        node.setAttribute("allowfullscreen", "true");
        node.setAttribute("src", "https://embed.ted.com/talks/" + value);
        return node;
    }

    static value(node: TedEmbed) {
        const src: string = node.getAttribute("src");
        const id = src.match(TED_EMBED_REGEXP)?.[1];
        return id;
    }
}
TedEmbed.blotName = 'ted';
TedEmbed.tagName = 'iframe';
GlobalQuill.register(TedEmbed, true);

export default class MediaEmbed {
    constructor(quill: Quill) {
        /* analog for matchAll
        const regexp = RegExp('foo*','g');
        const str = 'table football, foosball';
        
        while ((matches = regexp.exec(str)) !== null) {
          console.log(`Found ${matches[0]}. Next starts at ${regexp.lastIndex}.`);
          // expected output: "Found foo. Next starts at 9."
          // expected output: "Found foo. Next starts at 19."
        }*/
        const clipboard = quill.getModule("clipboard");

        quill.clipboard.addMatcher(Node.TEXT_NODE, (node: any, delta: Delta) => {
            const matches: string[] = Array.from(node.data.matchAll(YOUTUBE_REGEXP));
            if (matches && matches.length > 0) {
                console.log(matches);
                const ops = [];
                let str: string = node.data;
                for (const match of matches) {
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

        clipboard.addMatcher(Node.TEXT_NODE, (node: any, delta: Delta) => {
            const matches: string[] = Array.from(node.data.matchAll(TED_REGEXP));
            console.log(matches);
            if(matches && matches.length > 0) {
                console.log(matches);
                const ops = [];
                let str: string = node.data;
                for (const match of matches) {
                    const split = str.split(match[0]);
                    const beforeLink = split.shift();

                    ops.push({ insert: beforeLink });
                    ops.push({ insert: "\n" });
                    ops.push({ insert: { ted: match[1] } });
                    ops.push({ insert: "\n" });
                    str = split.join(match);
                }
                ops.push({ insert: str });
                delta.ops = ops;
            }
            return delta;
        })
    }
}

GlobalQuill.register('modules/mediaembed', MediaEmbed);