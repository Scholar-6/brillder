
import React from 'react'

import './Text.scss'
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


export interface TextComponentProps {
  locked: boolean;
  editOnly: boolean;
  index: number;
  data: any;
  validationRequired: boolean;
  save(): void;
  updateComponent(component: any, index: number): void;
}

const TextComponent: React.FC<TextComponentProps> = ({locked, editOnly, index, data, ...props}) => {
  const onChange = (htmlString: string) => {
    let comp = Object.assign({}, data);
    comp.value = htmlString;
    props.updateComponent(comp, index);
  }

  return (
    <div className="question-build-text-editor">
      <QuillEditor
        disabled={locked}
        data={data.value}
        toolbar={[
          'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
          'latex', 'bulletedList', 'numberedList', 'blockQuote'
        ]}
        onChange={onChange}
      />
    </div>
  );
}

export default TextComponent
