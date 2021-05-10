
import React from 'react'

import './Text.scss'
import { TextComponentObj } from './interface';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


export interface TextComponentProps {
  questionId: number;
  locked: boolean;
  editOnly: boolean;
  data: any;
  validationRequired: boolean;
  save(): void;
  updateComponent(component: TextComponentObj): void;
}

const FixedTextComponent: React.FC<TextComponentProps> = ({locked, editOnly, data, ...props}) => {
  const [refreshTimeout, setRefreshTimeout] = React.useState(-1);
  const [questionId, setQuestionId] = React.useState(props.questionId);
  const onChange = (htmlString: string) => {
    let comp = Object.assign({}, data);
    comp.value = htmlString;
    props.updateComponent(comp);
    props.save();
  }

  // refresh wiris component after question changed
  if (questionId !== props.questionId) {
    if (refreshTimeout === -1) {
      let timeout = setTimeout(() => {
        setRefreshTimeout(-1);
        setQuestionId(props.questionId);
      }, 100);
      setRefreshTimeout(timeout);
    }
    return <div></div>;
  } 

  return (
    <div className="question-build-text-editor first">
      <div className="text-label-container">
        Question Text
      </div>
      <QuillEditor
        disabled={locked}
        data={data.value}
        allowTables={true}
        toolbar={[
          'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
          'latex', 'bulletedList', 'numberedList', 'blockQuote', 'table',
        ]}
        onChange={onChange}
      />
    </div>
  );
}



export default FixedTextComponent
