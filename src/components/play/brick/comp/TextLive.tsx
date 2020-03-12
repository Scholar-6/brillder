import React from 'react';

import './TextLive.scss';


interface TextProps {
  component: any;
}

const TextLive: React.FC<TextProps> = ({ component }) => {
  return <div className="text-play" dangerouslySetInnerHTML={{ __html: component.value}} />;
}

export default TextLive;
