import React, { useEffect } from 'react'
import './Equation.scss'

declare var CKEDITOR: any;

export interface EquationComponentProps {
  index: number,
  data: any,
  updateComponent(component: any, index: number): void
}

const EquationComponent: React.FC<any> = () => {
  const id = "editor-" + new Date().getTime();

  useEffect(() => {
    CKEDITOR.replace(id, {
      extraPlugins: 'mathjax',
      mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
      removeButtons: 'Print,Cut,Copy,About,Paste,Source,Maximize,Scayt,JustifyCenter,JustifyRight,JustifyBlock,JustifyLeft,TextColor,RemoveFormat,CopyFormatting,BGColor,Link,Unlink,Image,Indent,Blockquote,NumberedList,BulletedList,Table,Outdent,Bold,Italic,Undo,Redo,Format,Font,FontSize,Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar',
      height: 320
    } );
  });

  return (
    <div className="question-build-text-editor">
      <div id={id}></div>
    </div>
  );
}

export default EquationComponent
