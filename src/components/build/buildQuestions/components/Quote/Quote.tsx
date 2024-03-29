import React from 'react'

import './Quote.scss'
import QuillEditor from 'components/baseComponents/quill/QuillEditor';
import { stripHtml } from 'components/build/questionService/ConvertService';


export interface QuoteComponentProps {
  locked: boolean;
  index: number;
  data: any;
  validationRequired: boolean;
  save(): void;
  updateComponent(component: any, index: number): void;

  // build phone preview
  onFocus(): void;
}

const QuoteComponent: React.FC<QuoteComponentProps> = ({locked, index, data, ...props}) => {
  const onChange = (htmlString: string) => {
    let comp = Object.assign({}, data);
    comp.value = htmlString;
    props.updateComponent(comp, index);
  }

  return (
    <div className="question-build-quote-editor" onFocus={props.onFocus}>
      <div className="text-label-container">
        Poem Quote
      </div>
      <QuillEditor
        disabled={locked}
        data={data.value}
        toolbar={['bold', 'italic', 'fontColor', 'bulletedList', 'numberedList']}
        validate={props.validationRequired}
        isValid={!!stripHtml(data.value)}
        onBlur={() => props.save()}
        placeholder="Poem text"
        onChange={onChange}
      />
    </div>
  );
}

export default QuoteComponent
