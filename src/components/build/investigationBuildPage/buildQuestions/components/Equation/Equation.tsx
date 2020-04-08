import React from 'react'
import './Equation.scss'
// @ts-ignore
import MathJax from 'react-mathjax'


declare var CKEDITOR: any;

export interface EquationComponentProps {
  index: number,
  data: any,
  updateComponent(component: any, index: number): void
}

const EquationComponent: React.FC<EquationComponentProps> = (props) => {

  const onChange = (value: string) => {
    let comp = props.data;
    comp.value = value;
    props.updateComponent(comp, props.index);
  }

  let exampleTex = 'E = \\frac{mc^2}{\\sqrt{1-\\frac{v^2}{c^2}}}';
 
  return (
    <div style={{minHeight: 170}} className="question-build-text-editor">
      <input style={{width: '82%', margin: '1%'}} value={props.data.value} onChange={(e) => onChange(e.target.value)} />
      {
        props.data.value ?
          <MathJax.Provider>
            <MathJax.Node formula={props.data.value} />
          </MathJax.Provider>
          : 
          <div style={{width: '100%', textAlign:'center'}}>
            <div>Example:</div>
            <div>{exampleTex}</div>
            <MathJax.Provider>
              <MathJax.Node formula={exampleTex} />
            </MathJax.Provider>
          </div>
      }
      <div style={{width: '100%', textAlign: 'center'}}>
        <a href="https://en.wikipedia.org/wiki/LaTeX">LaTex</a>
      </div>
    </div>
  );
}

export default EquationComponent

/* Old version
import React, { useEffect } from 'react'
import './Equation.scss'
// @ts-ignore
import MJ from 'react-mathjax-ts'


declare var CKEDITOR: any;

export interface EquationComponentProps {
  index: number,
  data: any,
  updateComponent(component: any, index: number): void
}

const EquationComponent: React.FC<EquationComponentProps> = (props) => {
  const id = "editor-" + new Date().getTime();
  const [created, setCreated] = React.useState(false);
  
  useEffect(() => {
    if (created === false) {
      var editor = CKEDITOR.replace(id, {
        extraPlugins: 'mathjax',
        mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
        removeButtons: 'Print,Cut,Copy,About,Paste,Source,Maximize,Scayt,JustifyCenter,JustifyRight,JustifyBlock,JustifyLeft,TextColor,RemoveFormat,CopyFormatting,BGColor,Link,Unlink,Image,Indent,Blockquote,NumberedList,BulletedList,Table,Outdent,Bold,Italic,Undo,Redo,Format,Font,FontSize,Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar',
        height: 100
      });
      editor.on('change', (e:any) => {
        let comp = Object.assign({}, props.data);
        comp.value = e.editor.getData();
        props.updateComponent(comp, props.index);
      });
      setCreated(true);
    }
  }, [id, props, created]);

  return (
    <div style={{minHeight: 170}} className="question-build-text-editor">
      <div id={id}></div>
    </div>
  );

}

export default EquationComponent
*/