
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
        toolbar: [
          { name: 'someName', items: [ 'Mathjax' ] }
        ],
        height: 100,
      });

      if (editor && props.data.value) {
        editor.setData(props.data.value);
      }

      editor.on('change', (e:any) => {
        let comp = Object.assign({}, props.data);
        comp.value = e.editor.getData();
        props.updateComponent(comp, props.index);
      });
      setCreated(true);
    }
  }, [id, props, created]);

  return (
    <div className="question-build-latex-editor">
      <div id={id}></div>
    </div>
  );

}

export default EquationComponent