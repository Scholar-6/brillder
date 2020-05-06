import React from "react";

import './SynthesisPreview.scss';


interface SynthesisPreviewProps {
  data: string;
}

const SynthesisPreviewComponent:React.FC<SynthesisPreviewProps> = ({data}) => {
  let newData = "";

  if (data) {
    newData = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  
  return (
    <div className="phone-preview-component synthesis-preview">
      <div className="synthesis-title" style={{textAlign: 'center'}}>SYNTHESIS</div>
      <div className="synthesis-text" dangerouslySetInnerHTML={{ __html: newData}}></div>
    </div>
  )
}

export default SynthesisPreviewComponent;
