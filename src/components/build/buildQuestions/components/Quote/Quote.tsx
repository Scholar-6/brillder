import React from 'react';
import Y from "yjs";
import { Grid } from '@material-ui/core';

import './Quote.scss'
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


export interface QuoteComponentProps {
  locked: boolean;
  index: number;
  data: Y.Map<any>;
  validationRequired: boolean;

  // build phone preview
  onFocus(): void;
}

const QuoteComponent: React.FC<QuoteComponentProps> = ({locked, index, data, ...props}) => {
  return (
    <div className="question-build-quote-editor" onFocus={props.onFocus}>
      <div className="text-label-container">
        Poem Quote
      </div>
      <QuillEditor
        disabled={locked}
        sharedData={data.get("value")}
        placeholder=""
        toolbar={['bold', 'italic', 'fontColor', 'bulletedList', 'numberedList']}
        validate={props.validationRequired}
      />
    </div>
  );
}

export default React.memo(QuoteComponent);
