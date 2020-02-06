import React from 'react'
/// <reference path="../@types/@ckeditor/ckeditor5-react/index.d.ts" />
import CKEditor from '@ckeditor/ckeditor5-react'; 
/// <reference path="../@types/@ckeditor/ckeditor5-build-classic/index.d.ts" />
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editorConfiguration = {
};

console.log(ClassicEditor)
const TextComponent: React.FC<any> = () => {
  return (<CKEditor
    editor={ ClassicEditor }
    data="<p>Hello from CKEditor 5!</p>"
    config={editorConfiguration}
    onInit={ (editor:any) => {
    } }
    onChange={ ( event: any, editor:any ) => {
        const data = editor.getData();
        console.log(data);
    } }
    onBlur={ ( event: any, editor: any ) => {
    } }
    onFocus={ ( event: any, editor: any ) => {
    } }
/>);
}

export default TextComponent
