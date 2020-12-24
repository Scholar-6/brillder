import React from 'react';

import './QuoteLive.scss';
import { PlayMode } from '../model';
import HighlightHtml from '../baseComponents/HighlightHtml';


interface TextProps {
  component: any;

  // build phone preview
  refs?: any;

  // only for real play
  mode?: PlayMode;
}

const QuoteLive: React.FC<TextProps> = ({ mode, refs, component }) => {
  if (mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) {
    return (
      <HighlightHtml value={component.value} mode={mode} onHighlight={()=>{}} />
    );
  }
  return (
    <div
      className="quotes-live"
      ref={refs}
      dangerouslySetInnerHTML={{ __html: component.value }}
    />
  );
}

export default QuoteLive;
