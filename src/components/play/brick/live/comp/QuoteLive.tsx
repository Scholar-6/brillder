import React from 'react';

import './QuoteLive.scss';


interface TextProps {
  component: any;
}

const TextLive: React.FC<TextProps> = ({ component }) => {
  return <div
    className="quotes-live"
    dangerouslySetInnerHTML={{ __html: component.value}} />;
}

export default TextLive;
