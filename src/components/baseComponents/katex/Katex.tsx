import 'katex/dist/katex.min.css';
import katex from 'katex';
import 'katex/contrib/mhchem/mhchem';

import React from 'react';

interface KatexProps {
    latex: string;    
}

const Katex: React.FC<KatexProps> = props => {
    const vectorMacro = (matrixEnv: string) => (ctx: any) => {
        const arg = ctx.consumeArgs(1)[0] as any[];
        const str = arg.reduce((prev, curr) => curr.text + prev, "") as string;
        const elements = str.replace(/\,/g, "\\\\")
        return `\\begin{${matrixEnv}}${elements}\\end{${matrixEnv}}`;
    };

    const macros = {
        "\\vector": vectorMacro("matrix"),
        "\\pvector": vectorMacro("pmatrix"),
        "\\bvector": vectorMacro("bmatrix"),
    }

    const ref = React.createRef<HTMLDivElement>();
    React.useEffect(() => {
        if(ref.current) {
            const spans = ref.current.getElementsByClassName("latex");
            while(spans.length > 0) {
                const el = spans[0];
                try {
                    katex.render(el.textContent!, el as HTMLSpanElement, {
                        throwOnError: false,
                        macros
                    });
                    el.className = "katex-rendered";
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }, [ref]);

    return (
        <div ref={ref} className="katex-overflow-scroll" dangerouslySetInnerHTML={{ __html: props.latex }} />
    );
};

export default Katex;