import React from 'react';
import Y from "yjs";

import './Text.scss'
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


export interface TextComponentProps {
  locked: boolean;
  editOnly: boolean;
  index: number;
  data: Y.Map<any>;
  validationRequired: boolean;

  // build phone preview
  onFocus(): void;
}

const TextComponent: React.FC<TextComponentProps> = ({locked, editOnly, index, data, ...props}) => {
  return (
    <div className="question-build-text-editor" onFocus={props.onFocus}>
      <QuillEditor
        disabled={locked}
        sharedData={data.get("value")}
        toolbar={[
          'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
          'latex', 'bulletedList', 'numberedList', 'blockQuote'
        ]}
      />
    </div>
  );
}

export default TextComponent
