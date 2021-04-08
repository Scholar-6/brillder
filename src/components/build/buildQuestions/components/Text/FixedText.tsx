import React from 'react';
import Y from "yjs";
import { Quill } from "react-quill";

import './Text.scss'
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


export interface TextComponentProps {
  questionId: number;
  locked: boolean;
  editOnly: boolean;
  data: Y.Map<any>;
  validationRequired: boolean;
}

const FixedTextComponent: React.FC<TextComponentProps> = ({locked, editOnly, data, ...props}) => {
  const [refreshTimeout, setRefreshTimeout] = React.useState(-1);
  const [questionId, setQuestionId] = React.useState(props.questionId);

  const quillContainer = React.createRef<HTMLDivElement>();

  const focus = React.useRef(() => {
    const quillElement = quillContainer.current?.getElementsByClassName("ql-container")[0];
    if(!quillElement) return;
    const quill = Quill.find(quillElement) as Quill;

    quill.focus();
  });

  focus.current?.();

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
        ref={quillContainer}
        disabled={locked}
        sharedData={data.get("value")}
        validate={props.validationRequired}
        showToolbar={false}
        toolbar={[
          'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
          'latex', 'bulletedList', 'numberedList', 'blockQuote'
        ]}
      />
    </div>
  );
}



export default FixedTextComponent
