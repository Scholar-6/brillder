import React, { useEffect } from 'react'
import './Equation.scss'
// @ts-ignore
import MathJax from 'react-mathjax';

declare var CKEDITOR: any;

export interface EquationComponentProps {
  index: number,
  data: any,
  updateComponent(component: any, index: number): void
}

const EquationComponent: React.FC<any> = () => {
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
        console.log(e.editor.getData());
      });
      setCreated(true);
    }
  });

  return (
    <div style={{minHeight: 170}} className="question-build-text-editor">
      <div id={id}></div>
    </div>
  );
}

export default EquationComponent
