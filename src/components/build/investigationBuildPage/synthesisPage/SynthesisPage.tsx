import React from 'react'
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';

import './SynthesisPage.scss';


export interface SynthesisProps {
  locked: boolean;
  synthesis: string;
  onSynthesisChange(text: string): void
  onReview(): void
}

const SynthesisPage: React.FC<SynthesisProps> = ({ locked, synthesis, onSynthesisChange, onReview }) => {
  return (
    <div className="question-type synthesis-page">
      <div className="inner-question-type">
        <DocumentWirisCKEditor
          disabled={locked}
          data={synthesis}
          placeholder=""
          toolbar={[
            'bold', 'italic', 'fontColor',
            'superscript', 'subscript', 'strikethrough',
            'mathType', 'chemType', 'insertTable', 'alignment',
            'bulletedList', 'numberedList', 'uploadImageCustom', 'addComment'
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
