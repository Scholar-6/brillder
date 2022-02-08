
import React from 'react'

import './Text.scss'
import QuillEditor from 'components/baseComponents/quill/QuillEditor';
import { stripHtml } from 'components/build/questionService/ConvertService';


export interface TextComponentProps {
  locked: boolean;
  editOnly: boolean;
  index: number;
  data: any;
  validationRequired: boolean;
  save(): void;
  updateComponent(component: any, index: number): void;

  // build phone preview
  onFocus(): void;
}

const TextComponent: React.FC<TextComponentProps> = ({locked, editOnly, index, data, ...props}) => {
  const onChange = (htmlString: string) => {
    let comp = Object.assign({}, data);
    comp.value = htmlString;
    props.updateComponent(comp, index);
    props.save();
  }

  return (
    <div className="question-build-text-editor" onFocus={props.onFocus}>
      <div className="text-label-container">
        Text
      </div>
      <QuillEditor
        disabled={locked}
        data={data.value}
        validate={props.validationRequired}
        isValid={!!stripHtml(data.value)}
        allowTables={true}
        toolbar={[
          'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
          'latex', 'bulletedList', 'numberedList', 'blockQuote', 'table', 'align',
          'uploadImageCustom', 'image'
        ]}
        placeholder="Additional text"
        imageDialog={true}
        onChange={onChange}
      />
    </div>
  );
}

export default TextComponent
