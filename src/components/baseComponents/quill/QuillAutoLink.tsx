import Quill from "quill";
import Delta from "quill-delta";
import { Quill as GlobalQuill } from "react-quill";
import axios from "axios";
import { TED_REGEXP, VIMEO_REGEXP, YOUTUBE_REGEXP } from "./QuillMediaEmbed";

const URL_REGEXP = /https?:\/\/[^\s]+/g;

const Embed = GlobalQuill.import("blots/block/embed");

export class LinkEmbedBlot extends Embed {
  static blotName = "link-embed";
  static tagName = "a";
  static className = "link-embed";

  static create(value: any) {
    const node: Element = super.create();
    node.setAttribute("data-title", value.title);
    node.setAttribute("data-description", value.description);
    node.setAttribute("data-url", value.url);
    node.setAttribute("data-image", value.image);
    node.setAttribute("href", value.url);
    node.setAttribute("target", "_blank")

    const image = document.createElement("img");
    image.src = value.image;
    image.alt = value.title;
    node.appendChild(image);

    const title = document.createElement("div");
    title.classList.add("embed-title");
    title.textContent = value.title;
    node.appendChild(title);

    const description = document.createElement("div");
    description.classList.add("embed-description");
    description.textContent = value.description;
    node.appendChild(description);

    return node;
  }

  static value(node: any): any {
    const title = node.getAttribute("data-title");
    const description = node.getAttribute("data-description");
    const url = node.getAttribute("data-url");
    const image = node.getAttribute("data-image");

    return { title, description, url, image };
  }
}
GlobalQuill.register(LinkEmbedBlot);

const getLinkMetadata = async (url: string) => {
  return (await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/og?url=${url}`, { withCredentials: true })).data;
}

export default class AutoLink {
    constructor(quill: Quill) {
        // on typing check autolink
        quill.on('text-change', function(delta:any, oldDelta: any, source: any) {
          function isWhitespace(ch:any) {
            return [' ', '\t', '\n'].includes(ch);
          }
  
          var regex = /https?:\/\/[^\s]+$/;
          if(delta.ops.length === 2 && delta.ops[0].retain && isWhitespace(delta.ops[1].insert)) {
            var endRetain = delta.ops[0].retain;
            var text = quill.getText().substr(0, endRetain);
            var match = text.match(regex);
        
            if(match !== null) {
              var url = match[0];
        
              var ops:any[] = [];
              if(endRetain > url.length) {
                ops.push({ retain: endRetain - url.length });
              }
        
              getLinkMetadata(url).then((linkMetadata) => {
                ops = ops.concat([
                  { delete: url.length },
                  { insert: { "link-embed": { ...linkMetadata } } }
                ]);
          
                quill.updateContents({ ops } as any);
              });
            }
          }
        });

        // on init check autolink
        quill.clipboard.addMatcher(Node.TEXT_NODE, (node: any, delta: Delta) => {
            const matches: string[] = node.data.match(URL_REGEXP);
            const selection = quill.getSelection();
            if(matches && matches.length > 0) {
                const ops: any[] = [];
                let str: string = node.data;
                for(const match of matches) {
                    if(quill.getModule("mediaembed") && (match.match(YOUTUBE_REGEXP) || match.match(TED_REGEXP) || match.match(VIMEO_REGEXP))) {
                      continue;
                    }
                    const split = str.split(match);
                    const beforeLink = split.shift();
                    ops.push({ insert: beforeLink });
                    ops.push({ insert: { "link-embed": { url: match, title: "Loading...", description: "", image: "" } } });
                    str = split.join(match);

                    getLinkMetadata(match).then((linkMetadata) => {
                      if(!selection) return;
                      const [embed, offset] = quill.getLeaf(selection.index + str.length);
                      embed.replaceWith("link-embed", { ...linkMetadata });
                    });
                }
                ops.push({ insert: str });
                delta.ops = ops;
            }
            return delta;
        });
    }
}

GlobalQuill.register('modules/autolink', AutoLink);