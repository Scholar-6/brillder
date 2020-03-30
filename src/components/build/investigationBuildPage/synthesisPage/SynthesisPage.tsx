import React from 'react'

import './SynthesisPage.scss';


export interface SynthesisProps {
  onSynthesisChange(text: string): void
  goBack(): void
}

const SynthesisPage: React.FC<SynthesisProps> = ({ onSynthesisChange, goBack }) => {
  document.title = "Synthesis";

  return (
    <div className="question-type">
      <div className="inner-question-type">
        <textarea
          placeholder="Synthesis"
          style={{width: '100%', height: '30vh', fontSize: '1.5vw'}}
          onChange={(e) => onSynthesisChange(e.target.value)}></textarea>
      </div>
    </div>
  );
}

export default SynthesisPage
