import React from 'react';

interface TextProps {
  component: any;
}


const TextLive: React.FC<TextProps> = ({ component }) => {
  return <div
    style={{font: '500 16px/24px "Montserrat"', color: 'black'}}
    dangerouslySetInnerHTML={{ __html: component.value}} />;
}

export default TextLive;
