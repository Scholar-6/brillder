import React from 'react';

import './QuoteLive.scss';


interface TextProps {
  component: any;
}

const QuoteLive: React.FC<TextProps> = ({ component }) => {
  return <div
    className="quotes-live"
    dangerouslySetInnerHTML={{ __html: component.value}} />;
}

export default QuoteLive;
