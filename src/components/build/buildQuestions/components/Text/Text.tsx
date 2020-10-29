
import React from 'react'

import './Text.scss'
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';


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
      <DocumentWirisCKEditor
        disabled={locked}
        editOnly={editOnly}
        data={data.value}
        placeholder=""
        colorsExpanded={true}
        toolbar={[
          'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
          'mathType', 'chemType', 'insertTable', 'bulletedList', 'numberedList', 'addComment',
        ]}
        blockQuote={true}
        validationRequired={props.validationRequired}
        onBlur={() => props.save()}
        onChange={onChange}
      />
    </div>
  );
}

export default TextComponent
