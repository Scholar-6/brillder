import { Delta } from "quill";
import { Quill } from "react-quill";

const URL_REGEXP = /https?:\/\/[^\s]+/g;

export default class AutoLink {
    constructor(quill: Quill) {
        // on typing check autolink
        quill.on('text-change', function(delta:any, oldDelta: any, source: any) {
          function isWhitespace(ch:any) {
            var whiteSpace = false
            if ((ch == ' ') || (ch == '\t') || (ch == '\n')) {
              whiteSpace = true;
            }
            return whiteSpace;
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
        
              ops = ops.concat([
                { delete: url.length },
                { insert: url, attributes: { link: url } }
              ]);
        
              quill.updateContents({ ops } as any);
            }
          }
        });

        // on init check autolink
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