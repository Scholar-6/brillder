import React from 'react'
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react'; 
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editorConfiguration = {
  toolbar: ['bold']
};

const TextComponent: React.FC<any> = () => {
  return (<CKEditor
    editor={ ClassicEditor }
    data="<p>Hello from CKEditor 5!</p>"
    config={editorConfiguration}
    onInit={ (editor:any) => {
    } }
    onChange={ ( event: any, editor:any ) => {
        const data = editor.getData();
    } }
    onBlur={ ( event: any, editor: any ) => {
    } }
    onFocus={ ( event: any, editor: any ) => {
    } }
/>);
}

export default TextComponent
