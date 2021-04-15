import { Delta } from "quill";
import { Quill } from "react-quill";

const URL_REGEXP = /https?:\/\/[^\s]+/g;

export default class AutoLink {
    constructor(quill: Quill) {
        quill.clipboard.addMatcher(Node.TEXT_NODE, (node: any, delta: Delta) => {
            const matches: string[] = node.data.match(URL_REGEXP);
            if(matches && matches.length > 0) {
                const ops = [];
                let str: string = node.data;
                for(const match of matches) {
                    const split = str.split(match);
                    const beforeLink = split.shift();
                    ops.push({ insert: beforeLink });
                    ops.push({ insert: match, attributes: { link: match } });
                    str = split.join(match);
                }
                ops.push({ insert: str });
                delta.ops = ops;
            }
            return delta;
        });
    }
}

Quill.register('modules/autolink', AutoLink);