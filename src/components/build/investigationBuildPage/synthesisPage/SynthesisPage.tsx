import React from 'react'
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';

import './SynthesisPage.scss';
import { Grid, Button } from '@material-ui/core';


export interface SynthesisProps {
  synthesis: string;
  onSynthesisChange(text: string): void
  onReview(): void
}

const SynthesisPage: React.FC<SynthesisProps> = ({ synthesis, onSynthesisChange, onReview }) => {
  return (
    <div className="question-type synthesis-page">
      <div className="inner-question-type">
        <DocumentWirisCKEditor
          data={synthesis}
          placeholder=""
          toolbar={[
            'bold', 'italic', 'fontColor',
            'superscript', 'subscript', 'strikethrough',
            'mathType', 'chemType', 'insertTable', 'alignment',
            'bulletedList', 'numberedList'
          ]}
          defaultAlignment="justify"
          onBlur={() => {}}
          onChange={onSynthesisChange}
        />
      </div>
    </div>
  );
}

export default SynthesisPage
