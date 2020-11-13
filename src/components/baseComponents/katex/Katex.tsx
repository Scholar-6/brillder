import 'katex/dist/katex.min.css';
import katex from 'katex';
import renderMathInElement from 'katex/dist/contrib/auto-render';

import React from 'react';

interface KatexProps {
    latex: string;    
}

const Katex: React.FC<KatexProps> = props => {
    const vectorMacro = (matrixEnv: string) => (ctx: any) => {
        const arg = ctx.consumeArgs(1)[0] as any[];
        const str = arg.reduce((prev, curr) => curr.text + prev, "") as string;
        const elements = str.replace(/\,/g, "\\\\")
        console.log(elements);
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
            for(let i = 0; i < spans.length; i++) {
                const el = spans[i];
                try {
                    katex.render(el.textContent!, el as HTMLSpanElement, {
                        throwOnError: false,
                        macros
                    });
                    el.className = "latex-rendered";
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }, [ref]);

    return (
        <div ref={ref} dangerouslySetInnerHTML={{ __html: props.latex }} />
    );
};

export default Katex;