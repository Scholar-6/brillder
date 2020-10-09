
import React from 'react'

import './Text.scss'
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import { TextComponentObj } from './interface';


export interface TextComponentProps {
  locked: boolean;
  editOnly: boolean;
  data: any;
  validationRequired: boolean;
  save(): void;
  updateComponent(component: TextComponentObj): void;
}

const FixedTextComponent: React.FC<TextComponentProps> = ({locked, editOnly, data, ...props}) => {
  const onChange = (htmlString: string) => {
    let comp = Object.assign({}, data);
    comp.value = htmlString;
    props.updateComponent(comp);
  }

  return (
    <div className="question-build-text-editor first">
      <DocumentWirisCKEditor
        disabled={locked}
        editOnly={editOnly}
        data={data.value}
        placeholder="Enter Question Text Here..."
        toolbar={[
          'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
          'mathType', 'chemType', 'insertTable', 'bulletedList', 'numberedList', 'addComment'
        ]}
        validationRequired={props.validationRequired}
        onBlur={() => props.save()}
        onChange={onChange}
      />
    </div>
  );
}

export default FixedTextComponent
