import Quill from "quill";
import Delta from "quill-delta";
import { Quill as GlobalQuill } from "react-quill";
import axios from "axios";
import { TED_REGEXP, VIMEO_REGEXP, YOUTUBE_REGEXP } from "./QuillMediaEmbed";

const URL_REGEXP = /https?:\/\/[^\s]+/g;

const BlockEmbed = GlobalQuill.import("blots/block/embed");

export class LinkEmbedBlot extends BlockEmbed {
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

    if(value.image && value.image !== "undefined") {
      const image = document.createElement("img");
      image.src = value.image;
      image.alt = value.title;
      node.appendChild(image);
    }

    const title = document.createElement("div");
    title.classList.add("embed-title");
    title.textContent = value.title;
    node.appendChild(title);

    if(value.description && value.description !== "undefined") {
      const description = document.createElement("div");
      description.classList.add("embed-description");
      description.textContent = value.description;
      node.appendChild(description);
    }

    const url = document.createElement("div");
    url.classList.add("embed-url");
    url.textContent = value.url;
    node.appendChild(url);

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

const Embed = GlobalQuill.import("blots/embed")
export class InlineLinkBlot extends Embed {
  static blotName = "inline-link"
  static tagName = "a"
  static className = "inline-link"

  static create(value: any) {
    const node: Element = super.create();
    node.setAttribute("data-title", value.title);
    node.setAttribute("data-url", value.url);
    node.setAttribute("data-image", value.image);
    node.setAttribute("href", value.url);
    node.setAttribute("target", "_blank")

    if(value.image && value.image !== "undefined") {
      const image = document.createElement("img");
      image.src = value.image;
      image.alt = value.title;
      node.appendChild(image);
    }

    const title = document.createElement("span");
    title.classList.add("inline-title");
    title.textContent = value.title;
    node.appendChild(title);

    return node;
  }

  static value(node: any): any {
    const title = node.getAttribute("data-title");
    const url = node.getAttribute("data-url");
    const image = node.getAttribute("data-image");

    return { title, url, image };
  }
}
GlobalQuill.register(InlineLinkBlot);

const getLinkMetadata = async (url: string) => {
  return (await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/og?url=${encodeURIComponent(url)}`, { withCredentials: true })).data;
}

const brillderRegex = new RegExp(`(${process.env.REACT_APP_FRONTEND_HOST})|(brillder.com)`);

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

                    if(match.match(brillderRegex)) {
                      const split = str.split(match);
                      const beforeLink = split.shift() ?? "";
                      if(beforeLink.length > 0) ops.push({ insert: beforeLink });
                      ops.push({ insert: { "inline-link": { url: match, title: "Loading...", image: "" } } });
                      str = split.join(match);

                      getLinkMetadata(match).then((linkMetadata) => {
                        if(!selection) return;
                        const [leaf] = quill.getLeaf(selection.index + beforeLink.length + 1);
                        console.log(selection.index, beforeLink.length, leaf);
                        leaf.replaceWith("inline-link", { ...linkMetadata });
                      });
                    } else {
                      const split = str.split(match);
                      const beforeLink = split.shift() ?? "";
                      ops.push({ insert: beforeLink });
                      ops.push({ insert: "\n" });
                      ops.push({ insert: { "link-embed": { url: match, title: "Loading...", description: "", image: "" } } });
                      ops.push({ insert: "\n" });
                      str = split.join(match);

                      getLinkMetadata(match).then((linkMetadata) => {
                        if(!selection) return;
                        const [embed] = quill.getLeaf(selection.index + beforeLink.length + 1);
                        console.log(selection.index, beforeLink.length, embed);
                        embed.replaceWith("link-embed", { ...linkMetadata });
                      });
                    }
                }
                if(str.length > 0) ops.push({ insert: str });
                delta.ops = ops;
                console.log(ops);
            }
            return delta;
        });

        quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node: any, delta: Delta, ...args: any[]) => {
          const linkEmbed = (delta.ops.find((op: any) => op.insert["link-embed"])?.insert as any)?.["link-embed"];
          if(linkEmbed) {
            console.log(node);
            if(linkEmbed.title === "Loading..." && linkEmbed.url) {
              getLinkMetadata(linkEmbed.url).then((linkMetadata) => {
                const domNode = document.querySelector(`a.link-embed[data-url="${linkEmbed.url}"]`);
                if(!domNode) return;
                const blot = GlobalQuill.find(domNode);
                console.log(blot);
                blot.replaceWith("link-embed", { ...linkMetadata });
              });
            }
          }

          const inlineLink = (delta.ops.find((op: any) => op.insert["inline-link"])?.insert as any)?.["inline-link"];
          if(inlineLink) {
            console.log(node);
            if(inlineLink.title === "Loading..." && inlineLink.url) {
              getLinkMetadata(inlineLink.url).then((linkMetadata) => {
                const domNode = document.querySelector(`a.inline-link[data-url="${inlineLink.url}"]`);
                if(!domNode) return;
                const blot = GlobalQuill.find(domNode);
                console.log(blot);
                blot.replaceWith("inline-link", { ...linkMetadata });
              });
            }
          }

          return delta;
        });
    }
}

GlobalQuill.register('modules/autolink', AutoLink);